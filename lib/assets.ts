/** Public files need the same build-time prefix as the exported app. */
export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${path.replace(/^\/+/, "")}`;
}
