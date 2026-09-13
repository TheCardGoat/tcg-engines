import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { blessingOfSurayaYellow as blessingRules } from "@tcg/flesh-and-blood-cards/cards/actions/blessing-of-suraya";
import { crossTheLineRed as crossTheLineRules } from "@tcg/flesh-and-blood-cards/cards/actions/cross-the-line";
import { nimblismBlue as nimblismRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { boltyn as boltynRules } from "@tcg/flesh-and-blood-cards/cards/heroes/boltyn";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const blessingOfSurayaYellow = previewCard(blessingRules);
const crossTheLineRed = previewCard(crossTheLineRules);
const nimblismBlue = previewCard(nimblismRules);
const boltyn = previewCard(boltynRules);
const dash = previewCard(dashRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-blessing-of-suraya-yellow",
  label: "Blessing of Suraya (yellow)",
  description:
    "A charged card has created Ponder while Blessing waits in the arena. Advance through the next Boltyn start phase to validate that Blessing enters soul and creates another Ponder.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "blessing-of-suraya-yellow", "charge", "ponder", "soul"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfSurayaYellow, crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(boltyn);
    player.play(blessingOfSurayaYellow);
    engine.untilIdle();
    player.playAttack(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-blessing-of-suraya-yellow");
  },
};
