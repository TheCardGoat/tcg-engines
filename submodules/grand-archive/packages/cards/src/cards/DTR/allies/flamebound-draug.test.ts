import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { flameboundDraug } from "./flamebound-draug.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers lz5escwkb1-a1 */
describe("Flamebound Draug — ephemeral entry trigger", () => {
  it("becomes ephemeral only when its entry trigger resolves and is banished on lethal combat damage", () => {
    const champion = createClassBonusTestChampion(flameboundDraug, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [flameboundDraug, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const card = p.card(flameboundDraug);
    const payment = p
      .cards(woodlandSquirrels)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    expect(() => p.activate(card, { reservePayment: payment.slice(1) })).toThrow();
    expect(game.state).toEqual(before);
    p.activate(card, { reservePayment: payment });
    p.pass();
    q.pass();
    expect(game.state.objects[card.objectId]!.zone).toBe("field");
    expect(game.state.objects[card.objectId]!.states.has("ephemeral")).toBe(false);
    expect(
      game.state.stack.some(
        (s) => s.kind === "triggered-ability" && s.ability.id === "lz5escwkb1-a1",
      ),
    ).toBe(true);
    passEffectsStack(game);
    expect(game.state.objects[card.objectId]!.states.has("ephemeral")).toBe(true);
    p.declareAttack(card, q.card(woodlandSquirrels));
    for (let i = 0; game.state.combat && i < 64; i++) {
      const decision = game.state.decision;
      if (decision?.kind === "choose-retaliators") {
        q.execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [q.card(woodlandSquirrels).objectId],
        });
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(game.state.combat).toBeNull();
    expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
    expect(p.cards(flameboundDraug, { zone: "graveyard" })).toHaveLength(0);
    expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
  });
});
