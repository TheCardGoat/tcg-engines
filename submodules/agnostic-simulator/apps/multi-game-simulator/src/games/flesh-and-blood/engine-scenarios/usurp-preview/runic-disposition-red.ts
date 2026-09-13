import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/runic-disposition.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";

import { runicDispositionRed as runicDispositionRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/runic-disposition";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const viserai = previewCard(viseraiRules);
const dash = previewCard(dashRules);
const runicDispositionRed = previewCard(runicDispositionRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-runic-disposition-red",
  label: "Runic Disposition (red)",
  description:
    "Printed ability and its legal choices. Usurp\nInstant - Discard this: Create a Runechant token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "runic-disposition-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = runicDispositionRed;

    const engine = FabTestEngine.start(
      { hero: viserai, hand: [card], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(viserai);
    player.activate(card);
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-runic-disposition-red");
  },
};
