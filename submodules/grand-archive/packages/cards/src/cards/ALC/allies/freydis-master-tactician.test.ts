import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { imperialRifleman } from "../../P24/allies/imperial-rifleman.ts";
import { freydisMasterTactician } from "./freydis-master-tactician.ts";

/** @covers 7dedg616r0-a1 */
describe("Freydis, Master Tactician — recollection tactics", () => {
  it("adds a tactic counter before glimpsing the new counter total", () => {
    const champion = createClassBonusTestChampion(
      freydisMasterTactician,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [freydisMasterTactician],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const freydis = player.card(freydisMasterTactician);
    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(game.state.objects[freydis.objectId]!.counters["named:tactic"]).toBe(1);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    expect(glimpse.cardIds).toHaveLength(1);
    answerDecision(game, "resolve-glimpse", { kind: "reorder", top: glimpse.cardIds, bottom: [] });
    passEffectsStack(game);
  });
});

/** @covers 7dedg616r0-a2 */
describe("Freydis, Master Tactician — Rangers always distant", () => {
  it("spends three tactic counters and keeps Ranger units distant across turns", () => {
    const champion = createClassBonusTestChampion(
      freydisMasterTactician,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [freydisMasterTactician, imperialRifleman, woodlandSquirrels],
          "main-deck": Array.from({ length: 16 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 16 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const freydis = player.card(freydisMasterTactician);
    for (let count = 1; count <= 3; count++) {
      advanceToRecollection(game, player.id);
      passEffectsStack(game);
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
      expect(glimpse.cardIds).toHaveLength(count);
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: glimpse.cardIds,
        bottom: [],
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[freydis.objectId]!.counters["named:tactic"]).toBe(3);
    player.activateAbility(freydis, "7dedg616r0-a2");
    passEffectsStack(game);
    expect(game.state.objects[freydis.objectId]!.counters["named:tactic"]).toBe(0);

    const ranger = player.card(imperialRifleman);
    const nonRanger = player.card(woodlandSquirrels, { zone: "field" });
    const championRef = player.card(champion);
    expect(game.state.objects[ranger.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[championRef.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[nonRanger.objectId]!.states.has("distant")).toBe(false);

    advanceToRecollection(game, player.id);
    expect(game.state.objects[ranger.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[championRef.objectId]!.states.has("distant")).toBe(true);
  });
});
