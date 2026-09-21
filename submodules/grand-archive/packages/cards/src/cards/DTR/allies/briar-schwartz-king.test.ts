import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { briarSchwartzKing } from "./briar-schwartz-king.ts";
import { backdash } from "../actions/backdash.ts";
import { secondWind } from "../../DOA/actions/second-wind.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainedHawk } from "../../DOA/allies/trained-hawk.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers r1zd9ys1qc-a1 @covers r1zd9ys1qc-a2 */
describe("Briar — grouped protections, Hindered, and forbidden wake", () => {
  it("enters rested, stays rested through successive wake phases, rejects Spells and ordinary attacks, but admits Skills and True Sight", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(briarSchwartzKing, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            briarSchwartzKing,
            backdash,
            secondWind,
            ...Array.from({ length: 6 }, () => woodlandSquirrels),
          ],
          field: [giantTortoise],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          field: [giantTortoise, trainedHawk],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(briarSchwartzKing);
    const payment = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(source, { reservePayment: payment(2) });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    const beforeSpell = game.state;
    expect(() =>
      p.activate(secondWind, {
        targets: { "target-1": [source.objectId] },
        reservePayment: payment(3),
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeSpell);
    p.activate(backdash, {
      targets: { "target-1": [source.objectId] },
      reservePayment: payment(1),
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(true);
    for (let turn = 0; turn < 2; turn++) {
      p.declareAttack(p.card(giantTortoise), q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[p.card(giantTortoise).objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      const before = game.state;
      expect(() => q.declareAttack(q.card(giantTortoise), source)).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        q.activate(fireball, {
          targets: { "target-1": [source.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      q.declareAttack(q.card(giantTortoise), p.card(giantTortoise));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[p.card(giantTortoise).objectId]!.states.has("rested")).toBe(false);
    }
    advanceToMain(game, q.id);
    q.declareAttack(q.card(trainedHawk), source);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  });
});
