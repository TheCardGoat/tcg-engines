import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { elucidatePlans } from "../../RDO/actions/elucidate-plans.ts";
import { innerCourtSchemer } from "./inner-court-schemer.ts";

/** @covers spijrps4ny-a1 */
describe("Inner Court Schemer — On Attack preparation", () => {
  for (const prepared of [false, true]) {
    for (const accept of [false, true]) {
      it(`has preparation=${prepared}, remove it=${accept}`, () => {
        const base = createClassBonusTestChampion(innerCourtSchemer, true, "activation-discount");
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
              field: [innerCourtSchemer],
              hand: prepared ? [elucidatePlans, woodlandSquirrels, woodlandSquirrels] : [],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        if (prepared) {
          player.activate(elucidatePlans, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(2);
        }
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(player.card(innerCourtSchemer, { zone: "field" }), target);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", accept && prepared);
        }
        passEffectsStack(game);
        if (prepared && accept) {
          expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(1);
        } else if (prepared) {
          expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(2);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(prepared && accept ? 3 : 1);
      });
    }
  }
});
