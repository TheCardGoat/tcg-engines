export interface FullscreenRequestResult {
  entered: boolean;
  reason?: string;
}

type FullscreenEnabledDocument = Document & {
  fullscreenEnabled?: boolean;
};

type SafariFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenEnabledElement = HTMLElement & {
  requestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function normalizeFullscreenError(error: unknown): string {
  if (error instanceof DOMException) {
    return error.message || error.name;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Fullscreen request failed.";
}

export function isFullscreenActive(
  candidateDocument: Document | undefined = globalThis.document,
): boolean {
  const safariDocument = candidateDocument as SafariFullscreenDocument | undefined;
  return Boolean(candidateDocument?.fullscreenElement ?? safariDocument?.webkitFullscreenElement);
}

export async function requestFullscreenSafe(
  element?: HTMLElement,
  candidateDocument: Document | undefined = globalThis.document,
): Promise<FullscreenRequestResult> {
  if (!candidateDocument) {
    return {
      entered: false,
      reason: "Fullscreen is unavailable outside the browser.",
    };
  }

  const target = (element ?? candidateDocument.documentElement) as
    | FullscreenEnabledElement
    | undefined;
  if (!target) {
    return {
      entered: false,
      reason: "No fullscreen target was available.",
    };
  }

  if (isFullscreenActive(candidateDocument)) {
    return { entered: true };
  }

  const standardDocument = candidateDocument as FullscreenEnabledDocument;

  try {
    if (standardDocument.fullscreenEnabled && typeof target.requestFullscreen === "function") {
      await target.requestFullscreen();
      return { entered: isFullscreenActive(candidateDocument) || true };
    }

    if (typeof target.webkitRequestFullscreen === "function") {
      await target.webkitRequestFullscreen();
      return { entered: isFullscreenActive(candidateDocument) || true };
    }
  } catch (error) {
    return {
      entered: false,
      reason: normalizeFullscreenError(error),
    };
  }

  return {
    entered: false,
    reason: "Fullscreen is not supported on this device.",
  };
}
