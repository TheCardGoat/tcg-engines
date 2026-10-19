// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import {
  MATCH_INTRO_SHELL,
  cancelMatchIntro,
  finishMatchIntro,
  resumeMatchIntro,
} from "@tcg/shared/match-intro";

const originalDecode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "decode");
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  Object.defineProperty(HTMLImageElement.prototype, "decode", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  document.body.innerHTML = `${MATCH_INTRO_SHELL}<main><button>Native action</button></main>`;
  window.history.replaceState({}, "", "/alpha-clash/simulator/matches/m/games/g");
  window.__tcgMatchIntro = {
    version: 1,
    variant: "banners",
    destination: location.href,
    createdAt: Date.now(),
    gameName: "Alpha Clash",
    playerName: "Anonymous",
    opponentName: "Anonymous",
    heading: "Match starting",
    loadingLabel: "Preparing",
    skipLabel: "Go to match",
  };
  resumeMatchIntro();
});
afterEach(() => {
  if (originalDecode) Object.defineProperty(HTMLImageElement.prototype, "decode", originalDecode);
  else Reflect.deleteProperty(HTMLImageElement.prototype, "decode");
  cancelMatchIntro();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const players = [
  { name: "Nova", artwork: "https://example.com/one.png" },
  { name: "Atlas", artwork: "https://example.com/two.png" },
] as const;

test("receiver replaces lobby labels with public artwork, then starts the board at reveal", async () => {
  const onReveal = vi.fn();
  finishMatchIntro({ players, onReveal });
  await vi.advanceTimersByTimeAsync(650);
  expect(document.documentElement.dataset.tcgMatchIntro).toBe("versus");
  expect(document.querySelector('[data-intro-text="playerName"]')?.textContent).toBe("Nova");
  expect(document.querySelector<HTMLImageElement>('[data-intro-art="playerName"]')?.hidden).toBe(
    false,
  );
  expect(onReveal).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1000);
  expect(onReveal).toHaveBeenCalledExactlyOnceWith(true);
  await vi.advanceTimersByTimeAsync(700);
  expect(document.documentElement.dataset.tcgMatchIntro).toBeUndefined();
  expect(document.querySelector("main")?.inert).toBeFalsy();
});

test("skip cancels the remaining versus timers and releases native controls", async () => {
  const onReveal = vi.fn();
  finishMatchIntro({ players, onReveal });
  await vi.advanceTimersByTimeAsync(1000);
  document.querySelector<HTMLButtonElement>(".match-intro-skip")?.click();
  await vi.advanceTimersByTimeAsync(750);
  expect(onReveal).toHaveBeenCalledExactlyOnceWith(false);
  expect(document.documentElement.dataset.tcgMatchIntro).toBeUndefined();
  await vi.advanceTimersByTimeAsync(8000);
  expect(document.documentElement.dataset.tcgMatchIntro).toBeUndefined();
});

test("reduced motion skips both the versus delay and opening choreography", async () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  const onReveal = vi.fn();
  finishMatchIntro({ players, onReveal });
  await vi.advanceTimersByTimeAsync(50);
  expect(onReveal).toHaveBeenCalledExactlyOnceWith(false);
  expect(document.documentElement.dataset.tcgMatchIntro).toBeUndefined();
});


test("cancelling a pending presentation also releases its opening choreography", async () => {
  const onReveal = vi.fn();
  finishMatchIntro({ players, onReveal });
  cancelMatchIntro();
  await vi.advanceTimersByTimeAsync(8000);
  expect(onReveal).toHaveBeenCalledExactlyOnceWith(false);
  expect(document.documentElement.dataset.tcgMatchIntro).toBeUndefined();
});
