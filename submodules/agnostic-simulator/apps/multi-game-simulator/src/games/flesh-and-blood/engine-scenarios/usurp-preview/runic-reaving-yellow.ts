import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/runic-reaving.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { runechant as runechantRules } from "@tcg/flesh-and-blood-cards/cards/tokens/runechant";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { runicReavingYellow as runicReavingYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/runic-reaving";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const runechant = previewCard(runechantRules);
const viserai = previewCard(viseraiRules);
const dash = previewCard(dashRules);
const runicReavingYellow = previewCard(runicReavingYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-runic-reaving-yellow",
  label: "Runic Reaving (yellow)",
  description:
    "Usurp requires one controlled Runechant and increases the attack by two. Usurp\nInstant - Discard this: Create a Runechant token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "runic-reaving-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = runicReavingYellow;
    const engine = FabTestEngine.start(
      { hero: viserai, hand: [card], arena: [runechant], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(viserai);
    player.play(card);
    player.target(runechant);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-runic-reaving-yellow");
  },
};
