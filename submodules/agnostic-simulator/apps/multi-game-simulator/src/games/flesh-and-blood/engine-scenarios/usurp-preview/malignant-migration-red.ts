import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/malignant-migration.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { hellboundAssaultRed as hellboundAssaultRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { malignantMigrationRed as malignantMigrationRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/malignant-migration";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const hellboundAssaultRed = previewCard(hellboundAssaultRedRules);
const malignantMigrationRed = previewCard(malignantMigrationRedRules);
const restlessClericRed = previewCard(restlessClericRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-malignant-migration-red",
  label: "Malignant Migration (red)",
  description:
    "happy: discarding a zombie puts a banished card into the graveyard. When this attacks, you may discard a zombie. If you do, put a card from your banished zone into your graveyard.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "malignant-migration-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [malignantMigrationRed, restlessClericRed],
        banished: [hellboundAssaultRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.play(malignantMigrationRed);
    game.advanceUntil({
      stopAt: "defend",
      optionals: "accept",
      entityTargets: "maximum",
    });
    return matchFromEngine(engine, "usurp-preview-malignant-migration-red");
  },
};
