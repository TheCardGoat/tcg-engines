import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { braveryOfTheBladeRed as braveryRules } from "@tcg/flesh-and-blood-cards/cards/actions/bravery-of-the-blade";
import { nimblismBlue as nimblismRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { boltyn as boltynRules } from "@tcg/flesh-and-blood-cards/cards/heroes/boltyn";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const braveryOfTheBladeRed = previewCard(braveryRules);
const nimblismBlue = previewCard(nimblismRules);
const boltyn = previewCard(boltynRules);
const dash = previewCard(dashRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-bravery-of-the-blade-red",
  label: "Bravery of the Blade (red)",
  description:
    "The charged attack has hit, returned its action point through go again, and created a Courage token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bravery-of-the-blade-red", "charge", "go-again", "courage"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [braveryOfTheBladeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(boltyn);
    player.playAttack(braveryOfTheBladeRed, { charge: true, chargeCard: nimblismBlue });
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-bravery-of-the-blade-red");
  },
};
