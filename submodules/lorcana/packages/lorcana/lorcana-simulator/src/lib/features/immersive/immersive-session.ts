export const IMMERSIVE_SESSION_STORAGE_KEY = "lorcana.immersive-session.started";
export const IMMERSIVE_ROUTE_ATTRIBUTE = "data-immersive-app";
export const IMMERSIVE_ROUTE_VALUE = "active";

export function readImmersiveSessionStarted(
  storage: Storage | undefined = globalThis.sessionStorage,
): boolean {
  return storage?.getItem(IMMERSIVE_SESSION_STORAGE_KEY) === "true";
}

export function persistImmersiveSessionStarted(
  storage: Storage | undefined = globalThis.sessionStorage,
): void {
  storage?.setItem(IMMERSIVE_SESSION_STORAGE_KEY, "true");
}

export function setImmersiveDocumentChrome(
  active: boolean,
  candidateDocument: Document | undefined = globalThis.document,
): void {
  const root = candidateDocument?.documentElement;
  const body = candidateDocument?.body;

  if (!root || !body) {
    return;
  }

  if (active) {
    root.setAttribute(IMMERSIVE_ROUTE_ATTRIBUTE, IMMERSIVE_ROUTE_VALUE);
    body.setAttribute(IMMERSIVE_ROUTE_ATTRIBUTE, IMMERSIVE_ROUTE_VALUE);
    return;
  }

  root.removeAttribute(IMMERSIVE_ROUTE_ATTRIBUTE);
  body.removeAttribute(IMMERSIVE_ROUTE_ATTRIBUTE);
}
