import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { healingAura } from "../phantasias/healing-aura.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { lenaDorumegiasHerald } from "../allies/lena-dorumegias-herald.ts";
import { takeCover } from "./take-cover.ts";

/** @covers 2ugmnmp5af-a1 */
describe("Take Cover — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: takeCover, discount: 1 });
});

function reachPhase(
  game: GrandArchiveTestEngine,
  playerId: string,
  phase: "recollection" | "main",
) {
  for (
    let step = 0;
    !(game.state.turn.playerId === playerId && game.state.turn.phase === phase) && step < 48;
    step++
  ) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.playerId).toBe(playerId);
  expect(game.state.turn.phase).toBe(phase);
}

/** @covers 2ugmnmp5af-a2 */
describe("Take Cover — Stealth and distant duration", () => {
  for (const targetKind of ["ally", "champion"] as const) {
    it(`protects a controlled ${targetKind} from attacks`, () => {
      const champion = createClassBonusTestChampion(takeCover, false, "activation-discount");
      const attackerChampion = createClassBonusTestChampion(
        lenaDorumegiasHerald,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [automatedGardener],
            hand: [takeCover, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: attackerChampion,
          zones: {
            field: [lenaDorumegiasHerald],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = targetKind === "ally" ? player.card(automatedGardener) : player.card(champion);
      opponent.pass();
      player.activate(takeCover, {
        targets: { "target-1": [target.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      const attacker = opponent.card(lenaDorumegiasHerald);
      const before = game.state;
      expect(() => opponent.declareAttack(attacker, target)).toThrow();
      expect(game.state).toEqual(before);

      // Stealth expires with the opponent's current turn; distant remains until
      // the protected unit controller's following turn ends.
      reachPhase(game, player.id, "recollection");
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      reachPhase(game, opponent.id, "main");
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      opponent.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
    });
  }

  it("rejects opposing units, non-units, private-zone units, and itself atomically", () => {
    const champion = createClassBonusTestChampion(takeCover, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [healingAura],
          hand: [
            takeCover,
            automatedGardener,
            ...Array.from({ length: 5 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    for (const target of [
      opponent.card(automatedGardener),
      player.card(healingAura),
      player.card(automatedGardener, { zone: "hand" }),
      player.card(takeCover),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(takeCover, {
          targets: { "target-1": [target.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card", cardId: card.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
  });
});
