import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { enlightenedStrikeRed } from "@tcg/flesh-and-blood-cards/cards/actions/enlightened-strike";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { dorintheaIronsong } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea-ironsong";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { flurry } from "@tcg/flesh-and-blood-cards/cards/tokens/flurry";
import { durendal } from "@tcg/flesh-and-blood-cards/cards/weapons/durendal";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const SEED = "flurry-durendal-blocked-remaining";

/**
 * Freeze the table after Flurry raises Durendal's attack limit, then a blocked
 * swing. The leftover attack is Flurry (on activation), not Dorinthea's
 * extra-on-hit. Matches the remaining-attacks chip after a miss.
 */
function bootFlurryDurendalBlockedRemaining() {
  const game = FabTestEngine.start(
    {
      hero: dorintheaIronsong,
      weapon1: [{ card: durendal, state: { powerCounterTotal: 2 } }],
      arena: [flurry],
      hand: [],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 6,
    },
    {
      hero: dash,
      hand: [snatchRed, enlightenedStrikeRed],
      life: 20,
      deck: 6,
    },
    FAB_MANUAL_HARNESS,
  );
  const Dori = game.as(dorintheaIronsong);
  const Dash = game.as(dash);

  Dori.activate(durendal);
  game.advanceToDecision(Dori, "boolean");
  Dori.chooseBoolean(true);
  game.advanceUntil({ stopAt: "defend" });
  // Durendal is 3 + two +1{p} counters = 5. Snatch d2 + Enlightened Strike d3
  // ties the attack, so it deals no damage and does not hit.
  Dash.defendWith(snatchRed, enlightenedStrikeRed);
  game.closeCombat({ optionals: "decline", ordering: "listed" });

  return matchFromEngine(game, SEED);
}

export const FLURRY_SCENARIOS = {
  [SEED]: {
    id: SEED,
    label: "Flurry · leftover Durendal attack after a miss",
    description:
      "Dorinthea accepted Flurry when activating Durendal. The 5-power swing was blocked 5, so her extra-on-hit did not fire. Durendal still has 1 attack left because Flurry sets the weapon to twice this turn on activation — not on hit. 0 AP remains, so the leftover attack cannot be paid for yet.",
    group: "combat",
    tags: ["engine", "flurry", "durendal", "dorinthea", "weapon", "activation-limit", "blocked"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootFlurryDurendalBlockedRemaining,
  },
} satisfies FabScenarioCollection;
