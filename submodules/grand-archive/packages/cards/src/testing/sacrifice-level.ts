import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

export function proveSacrificeLevel({
  card,
  abilityId,
  amount,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly abilityId: string;
  readonly amount: number;
}): void {
  for (const opponentTurn of [false, true]) {
    it(`grants ${amount} temporary levels until this turn ends (opponentTurn=${opponentTurn})`, () => {
      const champion = createClassBonusTestChampion(card, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opponentTurn ? "playerTwo" : "playerOne",
        playerOne: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const target = player.card(champion, { zone: "field" });
      const level = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "level", {
          program: game.program,
          state: game.state,
          controllerId: player.id,
          bindings: {},
        });
      if (opponentTurn) game.player("player-two").pass();
      player.activateAbility(card, abilityId);
      expect(player.cards(card, { zone: "field" })).toHaveLength(0);
      expect(level()).toBe(0);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      expect(level()).toBe(amount);
      const turn = game.state.turn.number;
      for (let step = 0; step < 32 && game.state.turn.number === turn; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.turn.number).toBe(turn + 1);
      expect(level()).toBe(0);
    });
  }
}
