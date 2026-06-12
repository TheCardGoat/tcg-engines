declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface UserProperties {
  user_type?: "logged_in" | "logged_out" | "premium" | "free";
  is_ad_free?: boolean;
  session_type?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Hash a string to create an anonymized identifier.
 * Simple but effective hash function for user IDs.
 */
export function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function setGAUserId(userId: string, measurementId = "G-VMTX3NQNVY"): void {
  if (typeof window === "undefined" || !window.gtag) return;
  const anonymizedId = hashUserId(userId);
  window.gtag("config", measurementId, { user_id: anonymizedId });
}

export function setGAUserProperties(properties: UserProperties): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("set", "user_properties", properties);
}

export function trackGAEvent(eventName: string, parameters?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, parameters);
}

export function trackGAPageView(url: string, title?: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: url, page_title: title });
}
