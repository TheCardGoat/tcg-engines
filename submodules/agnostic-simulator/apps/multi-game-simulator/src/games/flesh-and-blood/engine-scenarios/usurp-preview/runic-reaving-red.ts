import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/runic-reaving.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { runechant as runechantRules } from "@tcg/flesh-and-blood-cards/cards/tokens/runechant";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { runicReavingRed as runicReavingRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/runic-reaving";
import { runechantOfEnvyYellow } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-envy";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const runechant = previewCard(runechantRules);
const viserai = previewCard(viseraiRules);
const dash = previewCard(dashRules);
const runicReavingRed = previewCard(runicReavingRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-runic-reaving-red",
  label: "Runic Reaving (red)",
  description:
    "Select the highlighted Runechant directly to pay Usurp. The opponent’s Runechant is not eligible. Usurp\nInstant - Discard this: Create a Runechant token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "runic-reaving-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = runicReavingRed;
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [card],
        arena: [runechant, previewCard(runechantOfEnvyYellow)],
        deck: 6,
      },
      { hero: dash, hand: [], arena: [runechant], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(viserai);
    game.playInstance(player.id, player.cardIn("hand", card).instanceId, {}, "explicit");
    return matchFromEngine(engine, "usurp-preview-runic-reaving-red");
  },
};
