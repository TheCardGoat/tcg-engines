import { proveBrewEntry } from "../../../testing/brew-entry.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { alphaPhilterbeast } from "./alpha-philterbeast.ts";
import { stockedOutpost } from "../domains/stocked-outpost.ts";
import { glacierRemnants } from "../domains/glacier-remnants.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers NwK5wge8wy-a3
 * @covers NwK5wge8wy-a4
 */
describe("Alpha Philterbeast", () => {
  it("grows for opposing reserve costs at and above three, but not below three or for its owner", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(alphaPhilterbeast, true, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            alphaPhilterbeast,
            giantTortoise,
            ...Array.from({ length: 7 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          hand: [
            stockedOutpost,
            glacierRemnants,
            giantTortoise,
            ...Array.from({ length: 9 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(alphaPhilterbeast);
    const stats = (age: number) => {
      expect(game.state.objects[source.objectId]!.counters["named:age"] ?? 0).toBe(age);
      for (const [property, base] of [
        ["power", 2],
        ["life", 3],
      ] as const)
        expect(
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          }),
        ).toBe(base + age);
    };
    p.activate(source, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    stats(0);
    p.activate(giantTortoise, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    stats(0);
    advanceToMain(game, q.id);
    for (const [card, cost, age] of [
      [stockedOutpost, 2, 0],
      [glacierRemnants, 3, 1],
      [giantTortoise, 4, 2],
    ] as const) {
      q.activate(card, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      stats(age);
    }
  });
});

/** @covers NwK5wge8wy-a1 */
describe("Alpha Philterbeast Brew", () => {
  proveBrewPotion({
    card: alphaPhilterbeast,
    reserveCost: 3,
    ingredients: [fraysia, springleaf, blightroot],
    wrongIngredients: [fraysia, springleaf, woodlandSquirrels],
  });
});

/** @covers NwK5wge8wy-a2 */
describe("alphaPhilterbeast brewed entry", () => {
  proveBrewEntry({
    card: alphaPhilterbeast,
    ingredients: [fraysia, springleaf, blightroot],
    reserveCost: 3,
    age: 2,
  });
});
