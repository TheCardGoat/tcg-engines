const VITE_DEV_PATH = /(["'])\/(?=(?:@fs|@id|@react-router|@vite|src)\/)/g;

/** Keep a proxied development document's Vite module graph on its own server. */
export function applyDevAssetOrigin(html: string, configuredOrigin: string | undefined): string {
  const value = configuredOrigin?.trim();
  if (!value) return html;

  let origin: string;
  try {
    origin = new URL(value).origin;
  } catch {
    throw new Error(`Invalid VITE_DEV_ASSET_ORIGIN: ${value}`);
  }

  return html.replace(VITE_DEV_PATH, `$1${origin}/`);
}
