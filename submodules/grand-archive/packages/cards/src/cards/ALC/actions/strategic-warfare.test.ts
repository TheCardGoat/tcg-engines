import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shimmercloakAssassin } from "../allies/shimmercloak-assassin.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { strategicWarfare } from "./strategic-warfare.ts";

function rangerChampion(level: 0 | 1 | 2) {
  const base = lineageTestChampion("Strategic", level);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        typeLine: {
          ...base.layout.face.typeLine,
          classes: ["RANGER"],
          subtypes: ["RANGER"],
        },
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

function advanceToOwnMain(game: GrandArchiveTestEngine): void {
  const turn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > turn &&
      game.state.turn.playerId === game.player("player-one").id &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach the controller's next main phase");
}

function fixture(level: 1 | 2) {
  const starter = rangerChampion(0);
  const opponentChampion = lineageTestChampion("Strategic opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: Array.from({ length: level }, (_, index) => rangerChampion((index + 1) as 1 | 2)),
      zones: {
        field: [woodlandSquirrels, woodlandSquirrels, potionOfHealing],
        hand: [strategicWarfare, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: {
        field: [shimmercloakAssassin, shimmercloakAssassin],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, starter, opponentChampion };
}

/** @covers i1f0ht2tsn-a1 */
/** @covers i1f0ht2tsn-a2 */
describe("Strategic Warfare — locked ally power and level-restricted True Sight", () => {
  it("at level two buffs controlled allies and lets the targeted unit attack through Stealth", () => {
    const { game, starter, opponentChampion } = fixture(2);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attacker = player.cards(woodlandSquirrels, { zone: "field" })[0]!;
    const [hidden, laterHidden] = opponent.cards(shimmercloakAssassin, { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" });
    const beforeHiddenAttack = game.state;
    expect(() => player.declareAttack(attacker, hidden!)).toThrow();
    expect(game.state).toEqual(beforeHiddenAttack);

    for (const invalid of [player.card(potionOfHealing, { zone: "field" }), payment[2]!]) {
      const before = game.state;
      expect(() =>
        player.activate(strategicWarfare, {
          reservePayment: payment.slice(0, 2).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(strategicWarfare, {
      reservePayment: payment.slice(0, 2).map((card) => ({
        kind: "card",
        cardId: card.objectId,
      })),
      targets: { "target-1": [attacker!.objectId] },
    });
    passEffectsStack(game);
    player.declareAttack(attacker, hidden!);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[hidden!.objectId]!.zone).toBe("graveyard");

    advanceToOwnMain(game);
    const beforeExpiredSight = game.state;
    expect(() => player.declareAttack(attacker, laterHidden!)).toThrow();
    expect(game.state).toEqual(beforeExpiredSight);
    const enemyChampion = opponent.card(opponentChampion);
    player.declareAttack(attacker, enemyChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[enemyChampion.objectId]!.damage).toBe(1);
    expect(game.state.objects[player.card(starter).objectId]!.damage).toBe(0);
  });

  it("below level two omits the target paragraph but still buffs controlled allies", () => {
    const { game, opponentChampion } = fixture(1);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.cards(woodlandSquirrels, { zone: "field" })[0]!;
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 2);
    const beforeTargeted = game.state;
    expect(() =>
      player.activate(strategicWarfare, {
        reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
        targets: { "target-1": [ally.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeTargeted);

    player.activate(strategicWarfare, {
      reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const enemyChampion = opponent.card(opponentChampion);
    player.declareAttack(ally, enemyChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[enemyChampion.objectId]!.damage).toBe(2);
  });
});
