import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/blocks/rise-to-the-challenge.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { wreckerRompRed as wreckerRompRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { riseToTheChallengeRed as riseToTheChallengeRedRules } from "@tcg/flesh-and-blood-cards/cards/blocks/rise-to-the-challenge";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const snatchRed = previewCard(snatchRedRules);
const wreckerRompRed = previewCard(wreckerRompRedRules);
const riseToTheChallengeRed = previewCard(riseToTheChallengeRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-rise-to-the-challenge-red",
  label: "Rise to the Challenge (red)",
  description:
    "happy: revealing 6+ base {p} while defending gives this +2{d}. When this defends, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets +2{d}. Otherwise, put the revealed card on the bottom.\nInstant - Discard this: Your next attack this turn gets +2{p}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "rise-to-the-challenge-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [riseToTheChallengeRed],
        deck: [wreckerRompRed],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);
    Dash.playAttack(snatchRed);
    Rhinar.defendWith(riseToTheChallengeRed);
    game.toReaction();
    return matchFromEngine(engine, "usurp-preview-rise-to-the-challenge-red");
  },
};
