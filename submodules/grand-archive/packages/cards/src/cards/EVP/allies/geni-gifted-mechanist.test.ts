import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { supplyDrone } from "../../ALC/allies/supply-drone.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { cellConverter } from "../../MRC/allies/cell-converter.ts";
import { tuneUp } from "../../RDO/actions/tune-up.ts";
import { geniGiftedMechanist } from "./geni-gifted-mechanist.ts";

/** @covers wuir99sx6q-a1 */
describe("Geni, Gifted Mechanist — banished-card characteristics", () => {
  for (const [fuel, summonsDrone, addsBuffs] of [
    [cellConverter, true, true],
    [supplyDrone, true, false],
    [tuneUp, false, true],
    [woodlandSquirrels, false, false],
  ] as const) {
    it(`${grandArchiveTestFace(fuel).name}: drone=${summonsDrone}, buffs=${addsBuffs}`, () => {
      const champion = createClassBonusTestChampion(
        geniGiftedMechanist,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [geniGiftedMechanist, automatedGardener],
            hand: [woodlandSquirrels, woodlandSquirrels],
            graveyard: [fuel],
          },
        },
        playerTwo: { champion, zones: { banishment: [automatonDrone] } },
      });
      const player = game.player("player-one");
      const source = player.card(geniGiftedMechanist);
      const target = player.card(automatedGardener);
      const banished = player.card(fuel, { zone: "graveyard" });
      player.activateAbility(source, "wuir99sx6q-a1", {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        costSelections: [[banished.objectId]],
      });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[banished.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      if (addsBuffs) {
        expect(game.state.decision?.kind).toBe("resolve-effect-choice");
        answerDecision(game, "resolve-effect-choice", [target.objectId]);
        passEffectsStack(game);
      } else {
        expect(game.state.decision).toBeNull();
      }
      expect(player.cards(automatonDrone, { zone: "field" })).toHaveLength(summonsDrone ? 1 : 0);
      expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(addsBuffs ? 2 : 0);
    });
  }
});
