export interface RsvpData {
	name: string;
	phone: string;
	email?: string;
	guests: number;
	guestNames?: string;
	response: 'accept' | 'decline';
	dietary?: string;
	message?: string;
}

export interface RsvpResponse {
	success: boolean;
	message: string;
}

// Use a public form handler service or edge function
// For static export, we use a form action approach
const RSVP_ENDPOINT = '/api/rsvp';

// Use a per-call timestamp rather than a module-level variable
// to avoid stale state issues with SPA navigation
const formLoadTimestamps = new WeakMap<object, number>();

export function markFormLoaded(): object {
	const key = {};
	formLoadTimestamps.set(key, Date.now());
	return key;
}

export async function submitRsvp(data: RsvpData, formKey?: object): Promise<RsvpResponse> {
	// Anti-spam: check minimum time since form loaded (2 seconds)
	if (formKey) {
		const loadTime = formLoadTimestamps.get(formKey);
		if (loadTime) {
			const elapsed = Date.now() - loadTime;
			if (elapsed < 2000) {
				// Suspiciously fast submission — silently accept but don't save
				return { success: true, message: 'Thank you!' };
			}
		}
	}

	try {
		const response = await fetch(RSVP_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		// Retry logic for network failures
		console.debug('RSVP submission failed, retrying:', error);
		try {
			await new Promise(resolve => setTimeout(resolve, 1000));
			const retryResponse = await fetch(RSVP_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!retryResponse.ok) {
				throw new Error(`HTTP ${retryResponse.status}`);
			}

			return await retryResponse.json();
		} catch (retryError) {
			console.error('Retry failed:', retryError);
			return {
				success: false,
				message: 'Network error. Please try again.'
			};
		}
	}
}

/** Validate an Indian mobile number.
 * Accepts formats: 9876543210, +91-9876543210, 91 9876543210, 09876543210
 * Must be 10 digits starting with 6, 7, 8, or 9.
 */
function isValidIndianPhone(phone: string): boolean {
	// Strip everything except digits and leading +
	const cleaned = phone.replace(/[^\d+]/g, '');

	let digits: string;
	if (cleaned.startsWith('+91') && cleaned.length >= 13) {
		digits = cleaned.slice(3);
	} else if (cleaned.startsWith('91') && cleaned.length >= 12) {
		digits = cleaned.slice(2);
	} else if (cleaned.startsWith('0') && cleaned.length >= 11) {
		digits = cleaned.slice(1);
	} else {
		digits = cleaned;
	}

	// Must be exactly 10 digits
	if (digits.length !== 10) return false;

	// Indian mobile numbers start with 6, 7, 8, or 9
	return /^[6-9]/.test(digits);
}

export function validateRsvp(data: RsvpData): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!data.name || data.name.trim().length < 2) {
		errors.name = 'Name is required (min 2 characters)';
	}

	if (!data.phone || data.phone.trim().length < 10) {
		errors.phone = 'Valid phone number is required';
	} else if (!isValidIndianPhone(data.phone.trim())) {
		errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91-9876543210)';
	}

	if (!data.response) {
		errors.response = 'Please select your response';
	}

	if (data.guests < 1) {
		errors.guests = 'At least 1 guest required';
	}

	if (data.email && data.email.trim().length > 0) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email.trim())) {
			errors.email = 'Please enter a valid email';
		}
	}

	return errors;
}
