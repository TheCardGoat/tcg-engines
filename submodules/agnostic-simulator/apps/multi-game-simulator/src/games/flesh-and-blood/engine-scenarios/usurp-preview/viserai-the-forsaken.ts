import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/viserai-the-forsaken.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { envelopInDarknessRed as envelopInDarknessRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/envelop-in-darkness";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { viseraiTheForsaken as viseraiTheForsakenRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai-the-forsaken";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const envelopInDarknessRed = previewCard(envelopInDarknessRedRules);
const snatchRed = previewCard(snatchRedRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const viseraiTheForsaken = previewCard(viseraiTheForsakenRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-viserai-the-forsaken",
  label: "Viserai, the Forsaken",
  description:
    "happy: creating a Runechant banishes the top of your deck. Whenever you create 1 or more Runechants, banish the top card of your deck. Then if you've created 3 or more Runechants this turn, traverse.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "viserai-the-forsaken"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viseraiTheForsaken,
        hand: [envelopInDarknessRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viseraiTheForsaken);
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-viserai-the-forsaken");
  },
};
