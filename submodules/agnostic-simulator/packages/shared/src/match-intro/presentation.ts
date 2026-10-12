import { MATCH_INTRO_STORAGE_KEY, parseMatchIntro, type MatchIntroHandoff } from "./handoff";

declare global {
  interface Window {
    __tcgMatchIntro?: MatchIntroHandoff;
    __tcgIntroTransition?: Promise<void>;
    __tcgIntroDeadline?: number;
    __tcgIntroBootTimer?: number;
  }
}

/** Identical DOM in Svelte and React, present in the initial server-rendered document. */
export const MATCH_INTRO_SHELL = `<div id="tcg-match-intro" aria-hidden="true">
  <div class="match-intro-door match-intro-door-left"></div>
  <div class="match-intro-door match-intro-door-right"></div>
  <div class="match-intro-seam" aria-hidden="true"></div>
  <div class="match-intro-sweep" aria-hidden="true"></div>
  <div class="match-intro-content">
    <header><p data-intro-text="gameName"></p><h1 id="match-intro-heading" data-intro-text="heading"></h1></header>
    <div class="match-intro-versus">
      <div class="match-intro-player match-intro-player-left"><div class="match-intro-card" aria-hidden="true"><span data-intro-initial="playerName"></span><img data-intro-art="playerName" alt="" hidden></div><p data-intro-text="playerName"></p></div>
      <span class="match-intro-vs" aria-hidden="true">VS</span>
      <div class="match-intro-player match-intro-player-right"><div class="match-intro-card" aria-hidden="true"><span data-intro-initial="opponentName"></span><img data-intro-art="opponentName" alt="" hidden></div><p data-intro-text="opponentName"></p></div>
    </div>
  </div>
  <p class="match-intro-status" role="status" data-intro-text="loadingLabel"></p>
  <button class="match-intro-skip" type="button" data-intro-text="skipLabel"></button>
</div>`;

type IntroLabels = Pick<
  MatchIntroHandoff,
  "variant" | "gameName" | "playerName" | "opponentName" | "heading" | "loadingLabel" | "skipLabel"
>;
export interface MatchIntroPresentation {
  /** Public, viewer-safe identities supplied by the receiving simulator. */
  players?: readonly [{ name: string; artwork?: string }, { name: string; artwork?: string }];
  onReveal?: (animate: boolean) => void;
}
type Intro = {
  destination?: string;
  finish: (presentation?: MatchIntroPresentation) => void;
  cancel: () => void;
};
let active: Intro | null = null;

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setPhase(phase: string): void {
  document.documentElement.dataset.tcgMatchIntro = phase;
}

/** Own only this shell's descendants; both frameworks leave their markup static. */
function activate(data: IntroLabels, onSkip: () => void): (() => void) | null {
  const shell = document.getElementById("tcg-match-intro");
  if (!shell) return null;
  document.documentElement.dataset.tcgMatchIntroVariant = data.variant ?? "";
  for (const key of [
    "gameName",
    "playerName",
    "opponentName",
    "heading",
    "loadingLabel",
    "skipLabel",
  ] as const) {
    const text = shell.querySelector(`[data-intro-text="${key}"]`);
    if (text) text.textContent = data[key];
    const initial = shell.querySelector(`[data-intro-initial="${key}"]`);
    if (initial) initial.textContent = Array.from(data[key].trim())[0] ?? "";
  }
  shell.setAttribute("role", "dialog");
  shell.setAttribute("aria-modal", "true");
  shell.setAttribute("aria-labelledby", "match-intro-heading");
  shell.removeAttribute("aria-hidden");
  const previousFocus = document.activeElement;
  const inert: Array<[HTMLElement, boolean]> = [];
  // The Svelte root has a display:contents wrapper; don't inert the shell's ancestors.
  let branch: HTMLElement = shell;
  while (branch.parentElement && branch !== document.body) {
    for (const sibling of branch.parentElement.children) {
      if (
        sibling instanceof HTMLElement &&
        sibling !== branch &&
        !["SCRIPT", "STYLE"].includes(sibling.tagName)
      ) {
        inert.push([sibling, sibling.inert]);
        sibling.inert = true;
      }
    }
    branch = branch.parentElement;
  }
  const button = shell.querySelector<HTMLButtonElement>("button");
  button?.addEventListener("click", onSkip);
  const onKey = (event: KeyboardEvent) => {
    // Inert blocks DOM controls; capture also gates game shortcuts on window/document.
    event.stopImmediatePropagation();
    if (event.key === "Tab") {
      event.preventDefault();
      button?.focus({ preventScroll: true });
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onSkip();
    }
  };
  const blockKeyUp = (event: KeyboardEvent) => event.stopImmediatePropagation();
  const keepFocus = (event: FocusEvent) => {
    if (event.target instanceof Node && !shell.contains(event.target))
      button?.focus({ preventScroll: true });
  };
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", blockKeyUp, true);
  document.addEventListener("focusin", keepFocus, true);
  button?.focus({ preventScroll: true });
  return () => {
    for (const [element, wasInert] of inert) element.inert = wasInert;
    button?.removeEventListener("click", onSkip);
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("keyup", blockKeyUp, true);
    document.removeEventListener("focusin", keepFocus, true);
    button?.blur();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
      previousFocus.focus({ preventScroll: true });
    shell.setAttribute("aria-hidden", "true");
    shell.removeAttribute("role");
    shell.removeAttribute("aria-modal");
  };
}

/** Called only after matchmaking confirms a real match, never during acceptance. */
export function beginMatchIntro(options: IntroLabels & { href: string }): void {
  const destination = new URL(options.href, window.location.href);
  if (active?.destination === destination.href) return;
  cancelMatchIntro();
  // Development may use different ports. Do not rely on shared storage across origins.
  if (
    destination.origin !== location.origin ||
    !/\/simulator\/matches\/[^/]+\/games\/[^/]+\/?$/.test(destination.pathname) ||
    !document.getElementById("tcg-match-intro")
  ) {
    location.assign(destination.href);
    return;
  }
  let navigated = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const navigate = () => {
    if (navigated) return;
    navigated = true;
    for (const timer of timers) clearTimeout(timer);
    setPhase("handoff");
    const data: MatchIntroHandoff = {
      version: 1,
      variant: options.variant,
      destination: destination.href,
      createdAt: Date.now(),
      gameName: options.gameName.slice(0, 200),
      playerName: options.playerName.slice(0, 200),
      opponentName: options.opponentName.slice(0, 200),
      heading: options.heading.slice(0, 200),
      loadingLabel: options.loadingLabel.slice(0, 200),
      skipLabel: options.skipLabel.slice(0, 200),
    };
    try {
      sessionStorage.setItem(MATCH_INTRO_STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* Normal navigation still works. */
    }
    // Let the covered frame paint before the browser takes its outgoing snapshot.
    timers.push(
      setTimeout(
        () => {
          try {
            location.assign(destination.href);
          } catch {
            cancelMatchIntro();
          }
        },
        reducedMotion() ? 0 : 60,
      ),
    );
    // A failed/cancelled document navigation must not trap the lobby behind an overlay.
    timers.push(setTimeout(cancelMatchIntro, 10000));
  };
  setPhase("versus");
  const release = activate(options, navigate);
  if (!release) {
    navigate();
    return;
  }
  const restore = (event: PageTransitionEvent) => {
    if (event.persisted) cancelMatchIntro();
  };
  window.addEventListener("pageshow", restore);
  active = {
    destination: destination.href,
    finish: navigate,
    cancel: () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("pageshow", restore);
      release();
    },
  };
  if (reducedMotion() || options.variant === "banners") {
    navigate();
    return;
  }
  timers.push(setTimeout(() => setPhase("closing"), 2100));
  timers.push(setTimeout(navigate, 2550));
}

/** Called at app hydration. The tiny head bootstrap already painted the covered frame. */
export function resumeMatchIntro(): void {
  if (active || !window.__tcgMatchIntro) return;
  const data = parseMatchIntro(JSON.stringify(window.__tcgMatchIntro), location.href, Date.now());
  const holdMs = Math.min(
    8000,
    Math.max(0, (window.__tcgIntroDeadline ?? Date.now() + 10000) - Date.now() - 700),
  );
  clearTimeout(window.__tcgIntroBootTimer);
  delete window.__tcgIntroBootTimer;
  delete window.__tcgIntroDeadline;
  delete window.__tcgMatchIntro;
  if (!data) {
    cancelMatchIntro();
    return;
  }
  let finishing = false;
  let presentation: MatchIntroPresentation | undefined;
  let presented = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const reveal = (animate = true) => {
    if (finishing) return;
    finishing = true;
    timers.forEach(clearTimeout);
    // The covered frame survives the native document swap before its doors open.
    requestAnimationFrame(() => {
      void Promise.resolve(window.__tcgIntroTransition).then(() => {
        if (active !== intro) return;
        presentation?.onReveal?.(animate && !reducedMotion());
        setPhase("revealing");
        timers.push(setTimeout(cancelMatchIntro, reducedMotion() ? 0 : 700));
      });
    });
  };
  const release = activate(data, () => reveal(false));
  if (!release) {
    cancelMatchIntro();
    return;
  }
  const intro: Intro = {
    finish: (next) => {
      if (finishing) {
        next?.onReveal?.(false);
        return;
      }
      if (presented) return;
      presented = true;
      presentation = next;
      if (data.variant !== "banners" || !next?.players || reducedMotion()) {
        reveal();
        return;
      }
      const images: Promise<unknown>[] = [];
      for (const [index, key] of ["playerName", "opponentName"].entries()) {
        const player = next.players[index === 0 ? 0 : 1];
        const label = document.querySelector(`[data-intro-text="${key}"]`);
        if (label) label.textContent = player.name;
        const initial = document.querySelector<HTMLElement>(`[data-intro-initial="${key}"]`);
        if (initial) {
          initial.textContent = player.name;
          initial.hidden = false;
        }
        const image = document.querySelector<HTMLImageElement>(`[data-intro-art="${key}"]`);
        if (image && player.artwork) {
          image.src = player.artwork;
          images.push(
            image
              .decode()
              .then(() => {
                if (active !== intro) return;
                image.hidden = false;
                if (initial) initial.hidden = true;
              })
              .catch(() => undefined),
          );
        }
      }
      // Cache hits reveal at once. Slow/missing artwork cannot hold the board hostage.
      void Promise.race([
        Promise.allSettled(images),
        new Promise((resolve) => timers.push(setTimeout(resolve, 600))),
      ]).then(() => {
        if (active !== intro || finishing) return;
        setPhase("versus");
        timers.push(setTimeout(() => setPhase("closing"), 1300));
        timers.push(setTimeout(() => reveal(), 1550));
      });
    },
    cancel: () => {
      if (!finishing) presentation?.onReveal?.(false);
      timers.forEach(clearTimeout);
      window.removeEventListener("pageshow", cancelOnRestore);
      release();
    },
  };
  active = intro;
  // Do not cover the simulator's own loading, error or reconnect controls indefinitely.
  timers.push(setTimeout(() => reveal(false), holdMs));
  window.addEventListener("pageshow", cancelOnRestore);
}

function cancelOnRestore(event: PageTransitionEvent): void {
  if (event.persisted) cancelMatchIntro();
}

/** Call when the actual match/preparation surface commits, or when its error view is ready. */
export function finishMatchIntro(presentation?: MatchIntroPresentation): void {
  resumeMatchIntro();
  if (active) active.finish(presentation);
  else presentation?.onReveal?.(false);
}

export function cancelMatchIntro(): void {
  active?.cancel();
  active = null;
  for (const image of document.querySelectorAll<HTMLImageElement>("[data-intro-art]")) {
    image.hidden = true;
    image.removeAttribute("src");
  }
  for (const initial of document.querySelectorAll<HTMLElement>("[data-intro-initial]"))
    initial.hidden = false;
  delete document.documentElement.dataset.tcgMatchIntro;
  delete document.documentElement.dataset.tcgMatchIntroVariant;
  delete window.__tcgMatchIntro;
  delete window.__tcgIntroTransition;
  clearTimeout(window.__tcgIntroBootTimer);
  delete window.__tcgIntroBootTimer;
  delete window.__tcgIntroDeadline;
  try {
    sessionStorage.removeItem(MATCH_INTRO_STORAGE_KEY);
  } catch {
    /* Storage may be unavailable. */
  }
}
