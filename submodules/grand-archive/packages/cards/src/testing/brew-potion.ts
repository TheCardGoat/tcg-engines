import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

/** Brew 1–4: exact, disjoint ingredients replace reserve payment; no Class Bonus required. */
export function proveBrewPotion({
  card,
  ingredients,
  wrongIngredients,
  reserveCost,
}: {
  readonly card: Card;
  readonly ingredients: readonly Card[];
  readonly wrongIngredients: readonly Card[];
  readonly reserveCost: number;
}): void {
  function setup(field = ingredients, reserve = false) {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    return GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [...field, woodlandSquirrels],
          hand: [
            card,
            ...Array.from({ length: reserve ? reserveCost : 0 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion, zones: { field: ingredients } },
    });
  }
  function ingredientIds(game: GrandArchiveTestEngine, owner = "player-one") {
    return game
      .player(owner)
      .zone("field")
      .filter(
        (ref) =>
          ref.definitionId !== woodlandSquirrels.canonicalId &&
          game.state.objects[ref.objectId]?.isToken,
      )
      .map((ref) => ref.objectId);
  }

  it("sacrifices the complete recipe before resolution without paying reserve", () => {
    const game = setup();
    const player = game.player("player-one");
    const chosen = ingredientIds(game);
    expect(chosen).toHaveLength(ingredients.length);
    player.activate(card, { activationMethod: "brew", brewIngredientIds: chosen });
    expect(player.zone("memory")).toHaveLength(0);
    for (const id of chosen) expect(game.state.objects[id]?.zone).not.toBe("field");
    expect(player.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
    expect(game.state.stack.at(-1)?.activationStates).toContain("brewed");
    expect(player.cards(card, { zone: "field" })).toHaveLength(0);
    player.pass();
    game.player("player-two").pass();
    expect(player.cards(card, { zone: "field" })).toHaveLength(1);
  });

  it("can instead pay the printed reserve cost without sacrificing or becoming brewed", () => {
    const game = setup(ingredients, true);
    const player = game.player("player-one");
    const chosen = ingredientIds(game);
    player.activate(card, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    expect(player.zone("memory")).toHaveLength(reserveCost);
    expect(ingredientIds(game)).toEqual(chosen);
    expect(game.state.stack.at(-1)?.activationStates).not.toContain("brewed");
    player.pass();
    game.player("player-two").pass();
    expect(player.cards(card, { zone: "field" })).toHaveLength(1);
  });

  it("rejects an incomplete recipe without consuming anything", () => {
    const game = setup();
    const before = game.state;
    expect(() =>
      game.player("player-one").activate(card, {
        activationMethod: "brew",
        brewIngredientIds: ingredientIds(game).slice(1),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("rejects the wrong ingredient identities or subtypes even with the right count", () => {
    expect(wrongIngredients).toHaveLength(ingredients.length);
    const game = setup(wrongIngredients);
    const player = game.player("player-one");
    // Wrong recipes may include ordinary allies as well as the wrong Herb tokens.
    const chosen = player
      .zone("field")
      .filter(
        (ref) =>
          ref.definitionId !==
          createClassBonusTestChampion(card, false, "activation-discount").canonicalId,
      )
      .slice(0, wrongIngredients.length)
      .map((ref) => ref.objectId);
    const before = game.state;
    expect(() =>
      player.activate(card, { activationMethod: "brew", brewIngredientIds: chosen }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("cannot sacrifice the opponent's otherwise matching ingredients", () => {
    const game = setup();
    const before = game.state;
    expect(() =>
      game.player("player-one").activate(card, {
        activationMethod: "brew",
        brewIngredientIds: ingredientIds(game, "player-two"),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  if (ingredients.length > 1) {
    it("cannot use the same object twice to satisfy multiple ingredient slots", () => {
      const game = setup();
      const chosen = ingredientIds(game);
      const before = game.state;
      expect(() =>
        game.player("player-one").activate(card, {
          activationMethod: "brew",
          brewIngredientIds: [chosen[0]!, ...chosen.slice(0, -1)],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }
}
