import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { elucidatePlans } from "../../RDO/actions/elucidate-plans.ts";
import { scorchfireAssassin } from "./scorchfire-assassin.ts";

/** @covers o4h8cfo21a-a1 */
describe("Scorchfire Assassin — Class Bonus preparation power", () => {
  for (const classBonus of [false, true]) {
    for (const removed of [0, 1, 2] as const) {
      it(`classBonus=${classBonus}, remove ${removed} preparation`, () => {
        const base = createClassBonusTestChampion(
          scorchfireAssassin,
          classBonus,
          "activation-discount",
        );
        if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...base.layout.face,
              elements: ["NORM", "FIRE", "WATER", "WIND", "LUXEM"] as const,
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [scorchfireAssassin],
              hand: [elucidatePlans, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        player.activate(elucidatePlans, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(2);
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(player.card(scorchfireAssassin, { zone: "field" }), target);
        passEffectsStack(game);
        if (classBonus) {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          answerDecision(game, "resolve-effect-choice", removed);
          passEffectsStack(game);
          expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(2 - removed);
        } else {
          expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(2);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 1 + removed * 2 : 1);
      });
    }
  }
});
