import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

function namelessLevelUpDestination(): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  return {
    canonicalId: "nameless-level-up-destination",
    slug: "nameless-level-up-destination",
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: "nameless-level-up-destination:face:default",
        catalogId: "nameless-level-up-destination",
        name: "Nameless Champion",
        cost: { kind: "memory", amount: 2 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["SPIRIT"],
          subtypes: ["SPIRIT"],
        },
        elements: ["NORM"],
        stats: { level: 2, life: 22 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

/** Public contract for Nameless Champion's printed level-up forbid and once-per-instance (6) ability. */
export function proveNamelessChampion(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  const face = grandArchiveTestFace(card);
  const activated = face.abilities.find((ability) => ability.kind === "activated");
  if (!activated) throw new Error(`${face.name} must print the once-per-instance (6) ability.`);

  it("forbids an otherwise legal level-up materialization", () => {
    const destination = namelessLevelUpDestination();
    const starter = lineageTestChampion("Nameless", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [card],
        zones: {
          "material-deck": [destination],
          memory: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    const before = game.state;
    expect(() => player.materialize(destination)).toThrow(/forbidden|level up/i);
    expect(game.state).toEqual(before);
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(card.canonicalId);
  });

  it("pays six to draw and add one level counter, then cannot activate again", () => {
    const starter = lineageTestChampion("Nameless", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [card],
        zones: {
          hand: Array.from({ length: 12 }, () => woodlandSquirrels),
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: { "main-deck": [woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const champion = player.card(starter, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 6)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    const deck = player.zone("main-deck");
    const opponentDeck = opponent.zone("main-deck");
    const underpaid = payment.slice(0, 5);
    const beforeUnderpay = game.state;
    expect(() =>
      player.activateAbility(champion, activated.id, { reservePayment: underpaid }),
    ).toThrow();
    expect(game.state).toEqual(beforeUnderpay);

    player.activateAbility(champion, activated.id, { reservePayment: payment });
    const remainingHand = player.zone("hand");
    expect(remainingHand).toHaveLength(6);
    expect(player.zone("main-deck")).toEqual(deck);
    expect(game.state.objects[champion.objectId]?.counters.level ?? 0).toBe(0);
    passEffectsStack(game);
    expect(player.zone("hand")).toHaveLength(7);
    expect(player.zone("hand")).toContainEqual(deck[0]);
    expect(player.zone("main-deck")).toEqual(deck.slice(1));
    expect(game.state.objects[champion.objectId]?.counters.level).toBe(1);
    expect(opponent.zone("main-deck")).toEqual(opponentDeck);

    const beforeSecond = game.state;
    expect(() =>
      player.activateAbility(champion, activated.id, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 6)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeSecond);
    expect(game.state.objects[champion.objectId]?.counters.level).toBe(1);
  });
}
