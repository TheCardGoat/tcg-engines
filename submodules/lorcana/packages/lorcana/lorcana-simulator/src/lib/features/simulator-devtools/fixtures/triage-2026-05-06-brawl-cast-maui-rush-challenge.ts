import { brawl } from "@tcg/lorcana-cards/cards/004";
import { mauiHeroToAll, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";

export const triage20260506BrawlCastMauiRushChallengeFixture = createFixture({
  id: "triage-2026-05-06-brawl-cast-maui-rush-challenge",
  name: "Triage 2026-05-06 — Brawl can't cast + Maui Rush can't challenge (2 reports)",
  description:
    "Bug 1: Cast Brawl targeting Simba Protective Cub (strength 2, ≤2 threshold) — should banish it. Bug 2: Challenge with Maui Hero to All (Rush, isDrying) against the exerted Simba — Rush should allow the challenge despite being freshly played.",
  skipPreGame: true,
  playerOne: {
    inkwell: brawl.cost,
    hand: [brawl],
    play: [{ card: mauiHeroToAll, isDrying: true }],
    deck: 5,
  },
  playerTwo: {
    inkwell: 0,
    hand: [],
    play: [{ card: simbaProtectiveCub, exerted: true, isDrying: false }],
    deck: 5,
  },
});
