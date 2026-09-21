import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { veiledOracle } from "./veiled-oracle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";

/** @covers 4dpp2s3neh-a1 */
describe("Veiled Oracle — ephemeral entry and Glimpse 3", () => {
  proveGlimpsePlay({ card: veiledOracle, cost: { kind: "reserve", amount: 3 }, count: 3 });
  it("becomes ephemeral before the glimpse choice and is banished after lethal damage", () => {
    const champion = createClassBonusTestChampion(veiledOracle, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [veiledOracle, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      oracle = p.card(veiledOracle);
    p.activate(oracle, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    p.pass();
    q.pass();
    expect(game.state.objects[oracle.objectId]!.states.has("ephemeral")).toBe(false);
    passEffectsStack(game);
    expect(game.state.objects[oracle.objectId]!.states.has("ephemeral")).toBe(true);
    const decision = game.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
    expect(decision.cardIds).toHaveLength(3);
    answerDecision(game, "resolve-glimpse", { kind: "reorder", top: decision.cardIds, bottom: [] });
    passEffectsStack(game);
    advanceToMain(game, q.id);
    for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
      q.declareAttack(attacker, oracle);
      game.resolveCombatWithoutRetaliation();
    }
    expect(game.state.objects[oracle.objectId]!.zone).toBe("banishment");
  });
});
