import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Card-resolution Recover N on the controller's champion, Class Bonus disabled. */
export function proveRecoverChampion({
  card,
  amount,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly amount: number;
}): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number") {
    throw new Error(`${face.name} must have a fixed reserve cost.`);
  }
  const reserveCost = face.cost.amount;

  it(`removes ${amount} damage from the controller's champion only as the card resolves`, () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const startingDamage = amount + 1;
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: reserveCost }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: Array.from({ length: startingDamage }, () => woodlandSquirrels),
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const self = player.card(champion, { zone: "field" });
    const foe = opponent.card(champion, { zone: "field" });
    for (const attacker of opponent.cards(woodlandSquirrels, { zone: "field" })) {
      opponent.declareAttack(attacker, self);
      game.resolveCombatWithoutRetaliation();
    }
    opponent.pass();
    for (let step = 0; step < 64; step++) {
      if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind} returning to main`);
    }
    expect(game.state.objects[self.objectId]?.damage).toBe(startingDamage);
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, reserveCost)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    player.activate(card, { reservePayment: payment });
    expect(game.state.objects[self.objectId]?.damage).toBe(startingDamage);
    passEffectsStack(game);
    expect(game.state.objects[self.objectId]?.damage).toBe(startingDamage - amount);
    expect(game.state.objects[foe.objectId]?.damage).toBe(0);
  });
}
