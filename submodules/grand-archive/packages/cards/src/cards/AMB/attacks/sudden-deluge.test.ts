import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine, grandArchiveObjectId } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { extractionIncision } from "./extraction-incision.ts";
import { suddenDeluge } from "./sudden-deluge.ts";

function playAttack(
  game: GrandArchiveTestEngine,
  card: typeof suddenDeluge,
  attackerId: ReturnType<typeof grandArchiveObjectId>,
  targetId: ReturnType<typeof grandArchiveObjectId>,
  extra: { readonly prepareAbilityIndexes?: readonly [number, ...number[]] } = {},
): void {
  const player = game.player("player-one");
  player.activate(card, {
    attackAttackerId: attackerId,
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    ...extra,
  });
  passEffectsStack(game);
  declareResolvedAttack(game, attackerId, targetId, "declare Sudden Deluge");
}

/** @covers at3fn2idd6-a1 @covers at3fn2idd6-a2 */
describe("Sudden Deluge — Prepare and Class Bonus mill", () => {
  it("mills ten on a prepared champion hit only with Class Bonus", () => {
    const { starter } = classBonusLeveledChampion(suddenDeluge, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [
            extractionIncision,
            suddenDeluge,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attacker = player.card(starter, { zone: "field" });
    player.activate(extractionIncision, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      attacker.objectId,
      opponent.card(woodlandSquirrels, { zone: "field" }).objectId,
      "kill an ally to prepare",
    );
    advanceCombatToTrigger(game, "zthwm68lgo-a2");
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[attacker.objectId]!.counters.preparation).toBe(1);
    advanceToMain(game, player.id, game.state.turn.number);
    const deck = opponent.zone("main-deck");
    playAttack(
      game,
      suddenDeluge,
      attacker.objectId,
      opponent.card(starter, { zone: "field" }).objectId,
      {
        prepareAbilityIndexes: [0],
      },
    );
    const graveyardBefore = opponent.zone("graveyard");
    advanceCombatToTrigger(game, "at3fn2idd6-a2");
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(opponent.zone("graveyard")).toEqual([...graveyardBefore, ...deck.slice(0, 10)]);
  });
});
