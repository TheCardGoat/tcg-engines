export type OrientationPolicy = "portrait-only";

export interface ImmersiveCapabilities {
  fullscreenSupported: boolean;
  standardFullscreenSupported: boolean;
  safariFullscreenSupported: boolean;
  isIos: boolean;
  isIosSafari: boolean;
  isStandalone: boolean;
  orientationLockSupported: boolean;
  orientationPolicy: OrientationPolicy;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

function readUserAgent(candidateNavigator: Navigator | undefined): string {
  return candidateNavigator?.userAgent ?? "";
}

function detectIos(candidateNavigator: Navigator | undefined): boolean {
  const userAgent = readUserAgent(candidateNavigator);
  return /iPad|iPhone|iPod/.test(userAgent);
}

function detectIosSafari(candidateNavigator: Navigator | undefined): boolean {
  const userAgent = readUserAgent(candidateNavigator);

  if (!/iPad|iPhone|iPod/.test(userAgent)) {
    return false;
  }

  return /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
}

export function isRunningStandalonePwa(
  candidateWindow: Window | undefined = globalThis.window,
  candidateNavigator: Navigator | undefined = globalThis.navigator,
): boolean {
  const standaloneNavigator = candidateNavigator as NavigatorStandalone | undefined;

  if (standaloneNavigator?.standalone === true) {
    return true;
  }

  const mediaQueryWindow = candidateWindow as
    | (Window & { matchMedia?: (query: string) => MediaQueryList })
    | undefined;
  return Boolean(mediaQueryWindow?.matchMedia?.("(display-mode: standalone)").matches);
}

export function detectImmersiveCapabilities(
  candidateDocument: Document | undefined = globalThis.document,
  candidateWindow: Window | undefined = globalThis.window,
  candidateNavigator: Navigator | undefined = globalThis.navigator,
): ImmersiveCapabilities {
  const documentElement = candidateDocument?.documentElement as
    | (Element & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      })
    | undefined;

  const standardFullscreenSupported = Boolean(candidateDocument?.fullscreenEnabled);
  const safariFullscreenSupported = typeof documentElement?.webkitRequestFullscreen === "function";
  const isStandalone = isRunningStandalonePwa(candidateWindow, candidateNavigator);
  const isIos = detectIos(candidateNavigator);
  const isIosSafari = detectIosSafari(candidateNavigator);

  return {
    fullscreenSupported: standardFullscreenSupported || safariFullscreenSupported,
    standardFullscreenSupported,
    safariFullscreenSupported,
    isIos,
    isIosSafari,
    isStandalone,
    orientationLockSupported: false,
    orientationPolicy: "portrait-only",
  };
}
