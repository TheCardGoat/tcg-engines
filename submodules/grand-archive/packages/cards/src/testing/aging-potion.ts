import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Reach the next named player's recollection through public passes and materialization skips. */
export function advanceToRecollection(game: GrandArchiveTestEngine, playerId: string): void {
  const initialTurn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > initialTurn &&
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "recollection"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice") {
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    } else if (wait.kind === "opportunity") {
      game.player(wait.playerId).pass();
    } else {
      throw new Error(`Unexpected ${wait.kind} while advancing to recollection`);
    }
  }
  throw new Error("Did not reach the next recollection in 128 steps");
}

export function proveAgingPotion({
  card,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  it("gains one age on each own recollection trigger, never on an opponent's recollection", () => {
    const champion = createClassBonusTestChampion(card, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [card], "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
    });
    const potion = game.player("player-one").card(card, { zone: "field" });
    const age = () => game.state.objects[potion.objectId]?.counters["named:age"] ?? 0;
    for (const previousAge of [0, 1]) {
      advanceToRecollection(game, "player-two");
      expect(age()).toBe(previousAge);
      expect(game.state.stack).toHaveLength(0);
      advanceToRecollection(game, "player-one");
      expect(age()).toBe(previousAge);
      expect(game.state.stack).toHaveLength(1);
      passEffectsStack(game);
      expect(age()).toBe(previousAge + 1);
    }
  });
}
