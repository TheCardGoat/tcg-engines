import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/resources/arknight-shard.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { nimbleStrikeRed as nimbleStrikeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimble-strike";
import { arknightShardBlue as arknightShardBlueRules } from "@tcg/flesh-and-blood-cards/cards/resources/arknight-shard";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const nimbleStrikeRed = previewCard(nimbleStrikeRedRules);
const arknightShardBlue = previewCard(arknightShardBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-arknight-shard-blue",
  label: "Arknight Shard (blue)",
  description:
    "happy: pitching this creates a Runechant. Legendary Viserai Specialization\nWhen this is pitched, create a Runechant token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "arknight-shard-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [nimbleStrikeRed, arknightShardBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    Viserai.play(nimbleStrikeRed, { pitch: [arknightShardBlue] });
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-arknight-shard-blue");
  },
};
