import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { veritaQueenOfHearts } from "./verita-queen-of-hearts.ts";
import { twoOfHearts } from "./two-of-hearts.ts";
import { fourOfHearts } from "./four-of-hearts.ts";
import { fiveOfSpades } from "./five-of-spades.ts";
import { chainedCharge } from "../actions/chained-charge.ts";
import { brusqueNeige } from "../actions/brusque-neige.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
const champion = enableAllTestElements(
  createClassBonusTestChampion(veritaQueenOfHearts, false, "activation-discount"),
);

/** @covers 4qc47amgpp-a1 */
describe("Verita — graveyard alternative cost with an exact aggregate total", () => {
  for (const count of [0, 3, 4, 5]) {
    it(
      count ? `banishes ${count} Suited allies totaling ten` : "pays the ordinary ten reserve",
      () => {
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                veritaQueenOfHearts,
                twoOfHearts,
                ...Array.from({ length: 10 }, () => woodlandSquirrels),
              ],
              graveyard: [
                veritaQueenOfHearts,
                fourOfHearts,
                fourOfHearts,
                fiveOfSpades,
                fiveOfSpades,
                giantTortoise,
                ...Array.from({ length: 5 }, () => twoOfHearts),
              ],
              banishment: [twoOfHearts],
              field: [twoOfHearts],
            },
          },
          playerTwo: { champion, zones: { graveyard: [twoOfHearts] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(veritaQueenOfHearts, { zone: "hand" });
        const twos = p.cards(twoOfHearts, { zone: "graveyard" }),
          fours = p.cards(fourOfHearts),
          fives = p.cards(fiveOfSpades);
        const ids = (cards: typeof twos) => cards.map((c) => c.objectId);
        const selected =
          count === 3
            ? [twos[0]!, ...fours]
            : count === 4
              ? [...twos.slice(0, 3), fours[0]!]
              : twos;
        const before = game.state;
        for (const invalid of [
          [],
          ids(fives),
          [p.card(veritaQueenOfHearts, { zone: "graveyard" }).objectId],
          ids([twos[0]!, twos[1]!, fives[0]!]),
          ids([twos[0]!, fours[0]!, fives[0]!]),
          ids([twos[0]!, fours[0]!, fours[0]!]),
          ids([q.card(twoOfHearts), ...fours]),
          ids([p.card(twoOfHearts, { zone: "hand" }), ...fours]),
          ids([p.card(twoOfHearts, { zone: "field" }), ...fours]),
          ids([p.card(twoOfHearts, { zone: "banishment" }), ...fours]),
          ids([twos[0]!, fours[0]!, p.card(giantTortoise)]),
        ]) {
          expect(() =>
            p.activate(source, { costOptionIndex: 1, costSelections: [invalid] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (count) {
          p.activate(source, { costOptionIndex: 1, costSelections: [ids(selected)] });
          for (const card of selected)
            expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
          expect(p.zone("memory")).toHaveLength(0);
          expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(10);
        } else {
          const payment = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          expect(() => p.activate(source, { reservePayment: payment.slice(0, 9) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(p.zone("memory")).toHaveLength(10);
        }
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.decision).toBeNull();
        expect(p.cards(twoOfHearts, { zone: "hand" })).toHaveLength(1);
        expect(q.cards(twoOfHearts, { zone: "graveyard" })).toHaveLength(1);
      },
    );
  }
});

/** @covers 4qc47amgpp-a3 */
describe("Verita — death bonus lasts through the controller's next turn", () => {
  for (const opposingTurn of [false, true]) {
    it(`dies during ${opposingTurn ? "opposing" : "own"} turn`, () => {
      const zones = {
        hand: [
          nocturnesOblivion,
          twoOfHearts,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
        ],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: { ...zones, field: [veritaQueenOfHearts, fourOfHearts, woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { ...zones, field: [fourOfHearts] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        actor = opposingTurn ? q : p;
      actor.activate(nocturnesOblivion, {
        reservePayment: actor
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [p.card(veritaQueenOfHearts).objectId] },
      });
      passEffectsStack(game);
      expect(p.cards(veritaQueenOfHearts, { zone: "graveyard" })).toHaveLength(1);
      let total = 0;
      if (!opposingTurn) {
        p.declareAttack(p.card(fourOfHearts), q.card(champion));
        game.resolveCombatWithoutRetaliation();
        total += 2;
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
      }
      advanceToMain(game, p.id, game.state.turn.number);
      const late = p.card(twoOfHearts, { zone: "hand" });
      p.activate(late, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      p.declareAttack(late, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      total += 1;
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
      p.declareAttack(p.card(fourOfHearts), q.card(champion));
      game.resolveCombatWithoutRetaliation();
      total += 2;
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
      p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(champion));
      game.resolveCombatWithoutRetaliation();
      total += 1;
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
      advanceToMain(game, q.id);
      q.declareAttack(q.card(fourOfHearts), p.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      p.declareAttack(p.card(fourOfHearts), q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total + 1);
    });
  }
});

/** @covers 4qc47amgpp-a2 */
it("protects other owned Suited allies from lethal damage and destruction only while Verita remains", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { field: [veritaQueenOfHearts, twoOfHearts, fourOfHearts, woodlandSquirrels] },
    },
    playerTwo: {
      champion,
      zones: {
        field: [twoOfHearts, enfeebledDagger, enfeebledDagger, enfeebledDagger],
        hand: [
          nocturnesOblivion,
          nocturnesOblivion,
          ...Array.from({ length: 6 }, () => woodlandSquirrels),
        ],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    protectedAlly = p.card(twoOfHearts);
  const opportunity = () => {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    if (wait.playerId !== q.id) game.player(wait.playerId).pass();
  };
  for (const target of [protectedAlly, p.card(woodlandSquirrels), q.card(twoOfHearts)]) {
    opportunity();
    q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
      targets: { "target-unit": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).toBe(
      target.objectId === protectedAlly.objectId ? "field" : "graveyard",
    );
  }
  expect(game.state.objects[protectedAlly.objectId]!.damage).toBe(1);
  for (const target of [protectedAlly, p.card(veritaQueenOfHearts)]) {
    opportunity();
    q.activate(q.cards(nocturnesOblivion, { zone: "hand" })[0]!, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    if (target.objectId === protectedAlly.objectId)
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
  }
  expect(game.state.objects[protectedAlly.objectId]!.zone).toBe("graveyard");
  expect(p.cards(veritaQueenOfHearts, { zone: "graveyard" })).toHaveLength(1);
  expect(p.cards(fourOfHearts, { zone: "field" })).toHaveLength(1);
});

/** @covers 4qc47amgpp-a1 */
it("pays the full graveyard alternative before responses and does not refund it after negation", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { hand: [veritaQueenOfHearts], graveyard: [twoOfHearts, fourOfHearts, fourOfHearts] },
    },
    playerTwo: { champion, zones: { hand: [chainedCharge, woodlandSquirrels, woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(veritaQueenOfHearts);
  const fuel = [...p.cards(twoOfHearts), ...p.cards(fourOfHearts)];
  p.activate(source, { costOptionIndex: 1, costSelections: [fuel.map((c) => c.objectId)] });
  for (const card of fuel) expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
  const activation = game.state.stack.at(-1)!;
  p.pass();
  q.activate(chainedCharge, {
    reservePayment: q
      .cards(woodlandSquirrels)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    targets: { "target-stack-item": [activation.id] },
  });
  passEffectsStack(game);
  if (game.state.decision) answerDecision(game, "resolve-effect-payment", false);
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  for (const card of fuel) expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
  expect(p.zone("memory")).toHaveLength(0);
});

/** @covers 4qc47amgpp-a2 */
for (const zone of ["field", "graveyard"] as const)
  it(`new Suited ally enters with Verita in ${zone}`, () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          [zone]: [veritaQueenOfHearts],
          hand: [twoOfHearts, brusqueNeige, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      ally = p.card(twoOfHearts);
    p.activate(ally, {
      reservePayment: p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    p.pass();
    q.activateAbility(q.card(enfeebledDagger), "idpdon8f0h-a1", {
      targets: { "target-unit": [ally.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.zone).toBe(zone === "field" ? "field" : "graveyard");
    if (zone === "field") {
      const before = game.state;
      expect(() =>
        p.activate(brusqueNeige, { costOptionIndex: 1, costSelections: [[ally.objectId]] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(brusqueNeige, {
        costOptionIndex: 1,
        costSelections: [[p.card(veritaQueenOfHearts).objectId]],
      });
      passEffectsStack(game);
      expect(p.cards(veritaQueenOfHearts, { zone: "graveyard" })).toHaveLength(1);
      expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
    }
  });
