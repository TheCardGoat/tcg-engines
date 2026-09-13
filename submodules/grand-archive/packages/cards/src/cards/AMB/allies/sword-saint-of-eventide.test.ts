import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nanyuePortsman } from "./nanyue-portsman.ts";
import { rainweaverMage } from "./rainweaver-mage.ts";
import { ripplebackTerrapin } from "./rippleback-terrapin.ts";
import { tidestoneBovine } from "./tidestone-bovine.ts";
import { swordSaintOfEventide } from "./sword-saint-of-eventide.ts";

function drainForced(game: GrandArchiveTestEngine): void {
  for (let step = 0; step < 32; step++) {
    if (game.answerForcedDecision()) continue;
    if (game.state.decision || game.state.stack.length === 0) return;
    const wait = game.waitState();
    if (wait.kind !== "opportunity") return;
    game.player(wait.playerId).pass();
  }
}

/** @covers lve1my3486-a1 */
describe("Sword Saint of Eventide — On Enter look at the top card", () => {
  for (const mill of [false, true]) {
    it(`${mill ? "puts" : "leaves"} the looked-at card in the graveyard`, () => {
      const champion = createClassBonusTestChampion(
        swordSaintOfEventide,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [swordSaintOfEventide, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [nanyuePortsman, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const top = player.zone("main-deck")[0]!;
      player.activate(swordSaintOfEventide, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "lve1my3486-a1",
        ),
      ).toBe(true);
      drainForced(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", mill);
      }
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe(mill ? "graveyard" : "main-deck");
    });
  }
});

/** @covers lve1my3486-a2 */
describe("Sword Saint of Eventide — Class Bonus water-graveyard power", () => {
  for (const classBonus of [false, true]) {
    for (const waterCount of [3, 4] as const) {
      it(`classBonus=${classBonus}, water cards in graveyard=${waterCount}`, () => {
        const champion = createClassBonusTestChampion(
          swordSaintOfEventide,
          classBonus,
          "activation-discount",
        );
        const water = [nanyuePortsman, rainweaverMage, ripplebackTerrapin, tidestoneBovine].slice(
          0,
          waterCount,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [swordSaintOfEventide], graveyard: water },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const target = game.player("player-two").card(champion, { zone: "field" });
        player.declareAttack(player.card(swordSaintOfEventide, { zone: "field" }), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          classBonus && waterCount >= 4 ? 2 : 1,
        );
      });
    }
  }
});
