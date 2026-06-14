// All page routes should be pre-rendered for static export
// The API route (/api/rsvp) overrides this with prerender = false
export const prerender = true;

// Use directory-based routes (venue/index.html instead of venue.html)
// This ensures static file servers correctly serve pages on direct navigation
export const trailingSlash = 'always';
