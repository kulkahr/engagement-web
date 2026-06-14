export interface BlessingData {
	name: string;
	text: string;
}

export interface StoredBlessing extends BlessingData {
	date: string;
	timestamp: string;
}

export interface BlessingsResponse {
	success: boolean;
	message?: string;
	blessings?: StoredBlessing[];
	blessing?: StoredBlessing;
}

const BLESSINGS_ENDPOINT = '/api/blessings';

// Use a per-call timestamp for anti-spam (minimum time since form loaded)
const formLoadTimestamps = new WeakMap<object, number>();

export function markFormLoaded(): object {
	const key = {};
	formLoadTimestamps.set(key, Date.now());
	return key;
}

/**
 * Fetch all blessings from the server.
 * Falls back to an empty array on failure (handled by the page).
 */
export async function fetchBlessings(): Promise<StoredBlessing[]> {
	try {
		const response = await fetch(BLESSINGS_ENDPOINT, {
			method: 'GET',
			headers: { 'Accept': 'application/json' }
		});

		if (!response.ok) return [];

		const data: BlessingsResponse = await response.json();
		return data.blessings ?? [];
	} catch {
		return [];
	}
}

/**
 * Submit a blessing to the server.
 * @param formKey Optional anti-spam key from markFormLoaded()
 */
export async function submitBlessing(data: BlessingData, formKey?: object): Promise<BlessingsResponse> {
	// Anti-spam: check minimum time since form loaded (2 seconds)
	if (formKey) {
		const loadTime = formLoadTimestamps.get(formKey);
		if (loadTime) {
			const elapsed = Date.now() - loadTime;
			if (elapsed < 2000) {
				// Suspiciously fast submission — silently accept but don't save
				return { success: true, message: 'Blessing sent! 🙏' };
			}
		}
	}

	try {
		const response = await fetch(BLESSINGS_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const result: BlessingsResponse = await response.json();

		if (!response.ok) {
			return { success: false, message: result.message || 'Failed to send blessing.' };
		}

		return result;
	} catch {
		return { success: false, message: 'Network error. Please try again.' };
	}
}
