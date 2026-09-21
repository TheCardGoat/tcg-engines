import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { luceniasReign } from "./lucenias-reign.ts";
import { skeweringAdvance } from "../attacks/skewering-advance.ts";
import { snowWhiteWeissQueen } from "../allies/snow-white-weiss-queen.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { chargedDirective } from "../../MRC/attacks/charged-directive.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
const champion = enableAllTestElements(
  createClassBonusTestChampion(luceniasReign, false, "activation-discount"),
);
function giveOpportunity(game: GrandArchiveTestEngine, playerId: string) {
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
  if (wait.playerId !== playerId) game.player(wait.playerId).pass();
}
/** @covers zrvvwz3ww9-a1 */
describe("Lucenia's Reign — draw into memory on entry", () => {
  for (const deck of [1, 3])
    it(`draws once from a deck of ${deck} after the entry trigger resolves`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [luceniasReign, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: deck }, () => skeweringAdvance),
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(luceniasReign);
      const payment = p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(source, { reservePayment: payment.slice(0, 1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { reservePayment: payment });
      expect(p.zone("memory")).toHaveLength(2);
      p.pass();
      q.pass();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(p.zone("memory")).toHaveLength(2);
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(3);
      expect(p.cards(skeweringAdvance, { zone: "memory" })).toHaveLength(1);
      expect(p.zone("main-deck")).toHaveLength(deck - 1);
      expect(p.zone("hand")).toHaveLength(0);
      expect(q.zone("memory")).toHaveLength(0);
    });
});
function prepare(opposingTurn = false) {
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion,
      zones: {
        field: [luceniasReign, snowWhiteWeissQueen, woodlandSquirrels],
        hand: [
          skeweringAdvance,
          skeweringAdvance,
          chargedDirective,
          luceniasReign,
          ...Array.from({ length: 4 }, () => woodlandSquirrels),
        ],
        memory: [skeweringAdvance],
        graveyard: [skeweringAdvance, snowWhiteWeissQueen],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [snowWhiteWeissQueen, enfeebledDagger, enfeebledDagger, enfeebledDagger],
        hand: [
          skeweringAdvance,
          nocturnesOblivion,
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(luceniasReign, { zone: "field" }),
    target = p.card(snowWhiteWeissQueen, { zone: "field" });
  const payment = (n = 2) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const life = () =>
    deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
      program: game.program,
      state: game.state,
      controllerId: p.id,
      bindings: {},
    });
  giveOpportunity(game, p.id);
  return { game, p, q, source, target, payment, life };
}
/** @covers zrvvwz3ww9-a2 */
describe("Lucenia's Reign — paid Chessman Command discard, temporary life and memory draw", () => {
  it("requires both Chessman and Command, a hand discard, exact costs and an owned Chessman ally", () => {
    const { game, p, q, source, target, payment, life } = prepare();
    const valid = p.cards(skeweringAdvance, { zone: "hand" })[0]!,
      before = game.state;
    for (const ids of [
      [],
      [valid.objectId, valid.objectId],
      [p.card(chargedDirective).objectId],
      [p.card(luceniasReign, { zone: "hand" }).objectId],
      [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
      [p.card(skeweringAdvance, { zone: "memory" }).objectId],
      [p.card(skeweringAdvance, { zone: "graveyard" }).objectId],
      [q.card(skeweringAdvance).objectId],
    ]) {
      expect(() =>
        p.activateAbility(source, "zrvvwz3ww9-a2", {
          reservePayment: payment(),
          costSelections: [ids],
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    for (const targets of [
      [],
      [q.card(snowWhiteWeissQueen).objectId],
      [p.card(woodlandSquirrels, { zone: "field" }).objectId],
      [p.card(champion).objectId],
      [source.objectId],
      [p.card(snowWhiteWeissQueen, { zone: "graveyard" }).objectId],
      [target.objectId, target.objectId],
    ]) {
      expect(() =>
        p.activateAbility(source, "zrvvwz3ww9-a2", {
          reservePayment: payment(),
          costSelections: [[valid.objectId]],
          targets: { "target-1": targets },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    for (const reservePayment of [
      payment(1),
      [{ kind: "card" as const, cardId: valid.objectId }, ...payment(1)],
    ]) {
      expect(() =>
        p.activateAbility(source, "zrvvwz3ww9-a2", {
          reservePayment,
          costSelections: [[valid.objectId]],
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activateAbility(source, "zrvvwz3ww9-a2", {
      reservePayment: payment(),
      costSelections: [[valid.objectId]],
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[valid.objectId]!.zone).toBe("graveyard");
    expect(p.zone("memory")).toHaveLength(3);
    expect(life()).toBe(1);
    expect(p.zone("main-deck")).toHaveLength(3);
    passEffectsStack(game);
    expect(life()).toBe(2);
    expect(p.zone("memory")).toHaveLength(4);
    expect(p.zone("main-deck")).toHaveLength(2);
  });
  for (const opposingTurn of [false, true])
    for (const count of [1, 2])
      it(`stacks ${count} times and expires at this turn's end, opposing=${opposingTurn}`, () => {
        const { game, p, q, source, target, payment, life } = prepare(opposingTurn);
        for (let i = 0; i < count; i++) {
          giveOpportunity(game, p.id);
          const discard = p.cards(skeweringAdvance, { zone: "hand" })[0]!;
          p.activateAbility(source, "zrvvwz3ww9-a2", {
            reservePayment: payment(),
            costSelections: [[discard.objectId]],
            targets: { "target-1": [target.objectId] },
          });
          expect(life()).toBe(1 + i);
          passEffectsStack(game);
          expect(life()).toBe(2 + i);
        }
        expect(p.zone("memory")).toHaveLength(1 + 3 * count);
        expect(p.zone("main-deck")).toHaveLength(3 - count);
        for (let i = 0; i < count; i++) {
          giveOpportunity(game, q.id);
          q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
            targets: { "target-unit": [target.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[target.objectId]).toMatchObject({ zone: "field", damage: count });
        advanceToMain(game, opposingTurn ? p.id : q.id);
        expect(life()).toBe(1);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        giveOpportunity(game, q.id);
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[q.card(snowWhiteWeissQueen).objectId]!.damage).toBe(0);
      });
  for (const removeTarget of [false, true])
    it(`responding removal of ${removeTarget ? "target" : "source"}`, () => {
      const { game, p, q, source, target, payment, life } = prepare();
      const discard = p.cards(skeweringAdvance, { zone: "hand" })[0]!;
      p.activateAbility(source, "zrvvwz3ww9-a2", {
        reservePayment: payment(),
        costSelections: [[discard.objectId]],
        targets: { "target-1": [target.objectId] },
      });
      giveOpportunity(game, q.id);
      q.activate(nocturnesOblivion, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [removeTarget ? target.objectId : source.objectId] },
      });
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(removeTarget ? 3 : 4);
      expect(p.zone("main-deck")).toHaveLength(removeTarget ? 3 : 2);
      expect(game.state.objects[discard.objectId]!.zone).toBe("graveyard");
      if (removeTarget) expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
      else {
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(life()).toBe(2);
      }
    });
});
