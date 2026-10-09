import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { theDuchesssThornes } from "./the-duchesss-thornes.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { twoOfHearts } from "../../DTR/allies/two-of-hearts.ts";
import { fiveOfSpades } from "../../DTR/allies/five-of-spades.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";

/** @covers bEXmm4rKOs-a3 */
describe("The Duchess's Thornes Cardistry discount", () => {
  for (const expired of [false, true])
    it(`discounts only the next Cardistry activation: expired=${expired}`, () => {
      const champion = createClassBonusTestChampion(
        theDuchesssThornes,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [theDuchesssThornes, fiveOfSpades, fiveOfSpades],
            hand: Array.from({ length: 12 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activateAbility(theDuchesssThornes, "bEXmm4rKOs-a3");
      expect(p.cards(theDuchesssThornes, { zone: "banishment" })).toHaveLength(1);
      passEffectsStack(game);
      p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      if (expired) {
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      const allies = p.cards(fiveOfSpades);
      for (const [index, ally] of allies.entries()) {
        const cost = expired || index > 0 ? 4 : 0;
        const pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const memory = p.zone("memory").length;
        p.activateAbility(ally, "i9hf5lhl5f-a1", { reservePayment: pay });
        expect(p.zone("memory")).toHaveLength(memory + cost);
        passEffectsStack(game);
      }
    });
});

/** @covers bEXmm4rKOs-a2 */
describe("The Duchess's Thornes Cardistry trigger", () => {
  it("triggers on an ally's Cardistry ability", () => {
    const champion = createClassBonusTestChampion(theDuchesssThornes, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [theDuchesssThornes, twoOfHearts],
          hand: [woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [snowFairy, snowFairy],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      ally = p.card(twoOfHearts);
    const q = game.player("player-two"),
      targets = q.cards(snowFairy);
    const before = game.state;
    expect(() => p.declareAttack(ally, targets[0]!)).toThrow();
    expect(game.state).toEqual(before);
    p.activateAbility(ally, "rufki4o41y-a1", {
      reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
    });
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "bEXmm4rKOs-a2",
      ),
    ).toBe(true);
    passEffectsStack(game);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      }),
    ).toBe(4);
    p.declareAttack(ally, targets[0]!);
    game.resolveCombatWithoutRetaliation();
    expect(q.cards(snowFairy, { zone: "graveyard" })).toEqual([targets[0]!]);
    advanceToMain(game, p.id, game.state.turn.number);
    const after = game.state;
    expect(() => p.declareAttack(ally, targets[1]!)).toThrow();
    expect(game.state).toEqual(after);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      }),
    ).toBe(1);
  });
});

import { proveHinderedRestBanish } from "../../../testing/rest-banish-entry.ts";
/** @covers bEXmm4rKOs-a1 */
describe("The Duchess's Thornes Hindered cost restriction", () =>
  proveHinderedRestBanish(theDuchesssThornes, "bEXmm4rKOs-a3"));

import { wonderlandsReign } from "../../DTR/phantasias/wonderlands-reign.ts";
import { barrierServant } from "../../DOA/allies/barrier-servant.ts";
import { jewelOfEnlightenment } from "../../DOA/items/jewel-of-enlightenment.ts";

it("does not trigger for card activation, other ally abilities, or opposing Cardistry", () => {
  const champion = createClassBonusTestChampion(theDuchesssThornes, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [
          theDuchesssThornes,
          wonderlandsReign,
          barrierServant,
          jewelOfEnlightenment,
          jewelOfEnlightenment,
        ],
        hand: Array.from({ length: 12 }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [twoOfHearts], hand: [woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const noTrigger = () =>
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "bEXmm4rKOs-a2",
      ),
    ).toBe(false);
  p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
  noTrigger();
  passEffectsStack(game);
  for (const jewel of p.cards(jewelOfEnlightenment, { zone: "field" })) {
    p.activateAbility(jewel, "AKA19OwaCh-a1");
    noTrigger();
    passEffectsStack(game);
  }
  p.activateAbility(barrierServant, "xW6SZSlJX6-a2");
  noTrigger();
  passEffectsStack(game);
  p.activateAbility(wonderlandsReign, "0mf1ug6yfi-a1", {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 9)
      .map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  noTrigger();
  passEffectsStack(game);
  p.pass();
  q.activateAbility(twoOfHearts, "rufki4o41y-a1", {
    reservePayment: [{ kind: "card", cardId: q.card(woodlandSquirrels).objectId }],
  });
  noTrigger();
  passEffectsStack(game);
  expect(
    deriveGrandArchiveNumericProperty(game.state.objects[q.card(twoOfHearts).objectId]!, "power", {
      program: game.program,
      state: game.state,
      controllerId: q.id,
      bindings: {},
    }),
  ).toBe(3);
});

it("reduces a non-ally Cardistry cost by exactly six without consuming it on other abilities or opponents", () => {
  const champion = createClassBonusTestChampion(theDuchesssThornes, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [theDuchesssThornes, wonderlandsReign, jewelOfEnlightenment],
        hand: Array.from({ length: 6 }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [wonderlandsReign],
        hand: Array.from({ length: 9 }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  p.activateAbility(theDuchesssThornes, "bEXmm4rKOs-a3");
  passEffectsStack(game);
  p.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1");
  passEffectsStack(game);
  p.pass();
  const beforeOpponent = game.state;
  expect(() => q.activateAbility(wonderlandsReign, "0mf1ug6yfi-a1")).toThrow();
  expect(game.state).toEqual(beforeOpponent);
  q.activateAbility(wonderlandsReign, "0mf1ug6yfi-a1", {
    reservePayment: q
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  const pay = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  for (const invalid of [2, 4]) {
    const before = game.state;
    expect(() =>
      p.activateAbility(wonderlandsReign, "0mf1ug6yfi-a1", { reservePayment: pay(invalid) }),
    ).toThrow();
    expect(game.state).toEqual(before);
  }
  p.activateAbility(wonderlandsReign, "0mf1ug6yfi-a1", { reservePayment: pay(3) });
  expect(p.zone("memory")).toHaveLength(3);
  passEffectsStack(game);
  expect(p.zone("hand")).toHaveLength(4);
});
