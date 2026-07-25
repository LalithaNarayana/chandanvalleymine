// Normalizes a URL value coming from CMS/admin input so that links like
// "youtube.com" or "example.com" open as external absolute URLs instead of
// being treated as a relative path on the current site (e.g. localhost:3000/youtube.com).
// Internal links (starting with /, #, mailto:, tel:) are left untouched.
export function normalizeLink(url) {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
