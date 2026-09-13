import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/ice-aged-oak.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";

import { weaveIceBlue as weaveIceBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/weave-ice";
import { iceAgedOakBlue as iceAgedOakBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/ice-aged-oak";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);

const weaveIceBlue = previewCard(weaveIceBlueRules);
const iceAgedOakBlue = previewCard(iceAgedOakBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-ice-aged-oak-blue",
  label: "Ice Aged Oak (blue)",
  description:
    'happy: pitching Ice grants dominate, and a hit mints Embodiment plus Frostbites in each exposed seat. When this hits a hero, create an Embodiment of Earth token.\nIce Bond - If an Ice card was pitched to play this, this gets dominate and "When this hits a hero, create a Frostbite token in each of their exposed head, chest, arms, and legs zones."',
  group: "usurp-preview",
  tags: ["IAR", "preview", "ice-aged-oak-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceAgedOakBlue, weaveIceBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    game.as(dash);
    Bravo.must.pitch(weaveIceBlue).playAttack(iceAgedOakBlue);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-ice-aged-oak-blue");
  },
};
