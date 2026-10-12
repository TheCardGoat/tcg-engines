/** Presentation only. This record never establishes a player identity or joins a match. */
export interface MatchIntroHandoff {
  version: 1;
  variant?: "banners";
  destination: string;
  createdAt: number;
  gameName: string;
  playerName: string;
  opponentName: string;
  heading: string;
  loadingLabel: string;
  skipLabel: string;
}

export const MATCH_INTRO_STORAGE_KEY = "tcg.match-intro.v1";

/** Validate the presentation record again when the simulator hydrates. */
export function parseMatchIntro(
  raw: string | null,
  currentHref: string,
  now: number,
): MatchIntroHandoff | null {
  try {
    if (!raw || raw.length > 4096) return null;
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return null;
    if (value.variant !== undefined && value.variant !== "banners") return null;
    if (
      typeof value.createdAt !== "number" ||
      !Number.isFinite(value.createdAt) ||
      now - value.createdAt < 0 ||
      now - value.createdAt > 30_000
    )
      return null;
    const current = new URL(currentHref);
    const target = new URL(value.destination);
    if (
      !["http:", "https:"].includes(target.protocol) ||
      target.origin !== current.origin ||
      target.pathname !== current.pathname ||
      target.search !== current.search ||
      !/\/simulator\/matches\/[^/]+\/games\/[^/]+\/?$/.test(target.pathname)
    )
      return null;
    for (const key of [
      "gameName",
      "playerName",
      "opponentName",
      "heading",
      "loadingLabel",
      "skipLabel",
    ]) {
      if (typeof value[key] !== "string" || value[key].length > 200) return null;
    }
    return value;
  } catch {
    return null;
  }
}

/** Static, trusted script; no player/server data is interpolated into HTML. */
export const MATCH_INTRO_BOOTSTRAP = `(() => {
  const reset = () => {
    clearTimeout(window.__tcgIntroBootTimer);
    delete window.__tcgIntroBootTimer;
    delete window.__tcgIntroDeadline;
    delete document.documentElement.dataset.tcgMatchIntro;
    delete document.documentElement.dataset.tcgMatchIntroVariant;
    delete window.__tcgMatchIntro;
  };
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
  addEventListener('pageswap', event => {
    event.viewTransition?.ready.catch(() => {});
    if (!document.documentElement.dataset.tcgMatchIntro) event.viewTransition?.skipTransition();
  });
  addEventListener('pagereveal', event => {
    event.viewTransition?.ready.catch(() => {});
    if (!document.documentElement.dataset.tcgMatchIntro) event.viewTransition?.skipTransition();
    else if (event.viewTransition) window.__tcgIntroTransition = event.viewTransition.finished.catch(() => {});
  });
  try {
    const raw = sessionStorage.getItem(${JSON.stringify(MATCH_INTRO_STORAGE_KEY)});
    const entry = performance.getEntriesByType('navigation')[0];
    // Keep this source static across server and client compilation. Tests check
    // parity with parseMatchIntro, which validates again at hydration.
    if (!raw || raw.length > 4096) return;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return;
    if (data.variant !== undefined && data.variant !== "banners") return;
    if (typeof data.createdAt !== 'number' || !Number.isFinite(data.createdAt) ||
        Date.now() - data.createdAt < 0 || Date.now() - data.createdAt > 30000) return;
    const current = new URL(location.href);
    const target = new URL(data.destination);
    if (!['http:', 'https:'].includes(target.protocol) || target.origin !== current.origin ||
        target.pathname !== current.pathname || target.search !== current.search ||
        !/\\/simulator\\/matches\\/[^/]+\\/games\\/[^/]+\\/?$/.test(target.pathname)) return;
    for (const key of ['gameName', 'playerName', 'opponentName', 'heading', 'loadingLabel', 'skipLabel']) {
      if (typeof data[key] !== 'string' || data[key].length > 200) return;
    }
    sessionStorage.removeItem(${JSON.stringify(MATCH_INTRO_STORAGE_KEY)});
    if (entry && entry.type !== 'navigate') return;
    window.__tcgMatchIntro = data;
    document.documentElement.dataset.tcgMatchIntroVariant = data.variant || '';
    document.documentElement.dataset.tcgMatchIntro = 'holding';
    window.__tcgIntroDeadline = Date.now() + 10000;
    window.__tcgIntroBootTimer = setTimeout(reset, 10000);
  } catch { reset(); }
})();`;

/** Keep script markup out of Svelte templates so Vite does not scan it as a module. */
export const MATCH_INTRO_CRITICAL_CSS = `
html[data-tcg-match-intro="holding"]::before,
html[data-tcg-match-intro="handoff"]::before {
  content: ""; position: fixed; inset: 0; z-index: 2147482999;
  background: linear-gradient(90deg, #182d38 0%, #26767f 46%, #fff2d4 50%, #ad643b 54%, #382526 100%);
  pointer-events: none;
}
`;
export const MATCH_INTRO_HEAD_HTML = `<style>${MATCH_INTRO_CRITICAL_CSS}</style><script>${MATCH_INTRO_BOOTSTRAP}</script>`;
