import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/forsaken-strike.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones as gravyBonesRules } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessCorporalRed as restlessCorporalRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { forsakenStrikeYellow as forsakenStrikeYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/forsaken-strike";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const gravyBones = previewCard(gravyBonesRules);
const dash = previewCard(dashRules);
const restlessCorporalRed = previewCard(restlessCorporalRedRules);
const forsakenStrikeYellow = previewCard(forsakenStrikeYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-forsaken-strike-yellow",
  label: "Forsaken Strike (yellow)",
  description:
    "Choose a zombie to destroy, one to discard, then choose two rewards. As an additional cost to play this, you may destroy up to 3 zombies you control and/or discard up to 3 zombies. Choose a mode for each zombie destroyed or discarded this way;\n- Create a Gate to i'Arathael token.\n- This gets +2{p}.\n- This gets go again.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "forsaken-strike-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow, restlessCorporalRed],
        arena: [restlessCorporalRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(gravyBones);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    return matchFromEngine(engine, "usurp-preview-forsaken-strike-yellow");
  },
};
