import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { sempiternalSage } from "./sempiternal-sage.ts";

/** @covers zmoegdo111-a2 */
describe("Sempiternal Sage — Class Bonus recover or empower", () => {
  for (const classBonus of [false, true]) {
    for (const recover of [false, true]) {
      it(`classBonus=${classBonus}, recover=${recover}`, () => {
        const champion = createClassBonusTestChampion(
          sempiternalSage,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [sempiternalSage] } },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.declareAttack(
          player.card(sempiternalSage, { zone: "field" }),
          opponent.card(champion, { zone: "field" }),
        );
        passEffectsStack(game);
        if (classBonus) {
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", recover);
          passEffectsStack(game);
          expect(game.state.players[player.id]!.states.empower ?? 0).toBe(recover ? 0 : 3);
        } else {
          expect(game.state.decision).toBeNull();
          expect(game.state.players[player.id]!.states.empower ?? 0).toBe(0);
        }
        game.resolveCombatWithoutRetaliation();
        expect(
          game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage,
        ).toBe(3);
      });
    }
  }
});
