import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/blocks/echoing-trap.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { azalea as azaleaRules } from "@tcg/flesh-and-blood-cards/cards/heroes/azalea";
import {
  brutalAssaultBlue as brutalAssaultBlueRules,
  brutalAssaultRed as brutalAssaultRedRules,
} from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { echoingTrapBlue as echoingTrapBlueRules } from "@tcg/flesh-and-blood-cards/cards/blocks/echoing-trap";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const azalea = previewCard(azaleaRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const brutalAssaultRed = previewCard(brutalAssaultRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const echoingTrapBlue = previewCard(echoingTrapBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-echoing-trap-blue",
  label: "Echoing Trap (blue)",
  description:
    "Printed ability and its legal choices. Ambush\nWhen this defends an attack action card with the same name as another card played this turn, the attacking hero discards a card.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "echoing-trap-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const repeated = true;

    const engine = FabTestEngine.start(
      {
        hero: dash,
        hand: [repeated ? brutalAssaultRed : nimblismBlue, brutalAssaultBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [echoingTrapBlue], life: 30, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const attacker = game.as(dash);
    if (repeated) {
      attacker.playAttack(brutalAssaultRed);
      game.closeCombat();
    } else {
      attacker.play(nimblismBlue);
      game.untilIdle();
    }
    attacker.playAttack(brutalAssaultBlue);
    game.as(azalea).defendWith(echoingTrapBlue);
    game.untilIdle({ entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-echoing-trap-blue");
  },
};
