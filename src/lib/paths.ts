const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

// Public files need the repository prefix on a GitHub Pages project site.
// Keep stored content paths rooted at /photos, /brand, etc.
export function publicAssetPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
