export const SITE_ORIGIN = "https://tcg.online";
export const SITE_NAME = "The Card Goat";
export const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/social-banner.png`;

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path}`;
}
