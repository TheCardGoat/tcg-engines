import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { durendal } from "@tcg/flesh-and-blood-cards/cards/weapons/durendal";
import { shiftTheTideOfBattleYellow } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/shift-the-tide-of-battle";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const SHIFT_TIDE_SCENARIOS = {
  "shift-tide-arsenal-feedback": {
    id: "shift-tide-arsenal-feedback",
    label: "Shift the Tide · arsenal feedback",
    description:
      "Dorinthea has priority in the reaction step. Durendal attacks at 4 power with a +1 power counter. Try playing Shift the Tide of Battle from arsenal to inspect blocked-play feedback.",
    group: "combat",
    tags: ["engine", "arsenal", "reaction", "feedback"],
    viewerId: "player-1",
    botMode: "off",
    boot: () => {
      const game = FabTestEngine.start(
        {
          hero: dorinthea,
          weapon1: [{ card: durendal, state: { powerCounterTotal: 1 } }],
          hand: [],
          arsenal: [shiftTheTideOfBattleYellow],
          resourcePoints: 3,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, hand: [snatchRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(dorinthea).activateAttack(durendal);
      game.as(dash).defendWith([snatchRed]);
      game.toReaction("attacker");
      return matchFromEngine(game, "shift-tide-arsenal-feedback");
    },
  },
} satisfies FabScenarioCollection;
