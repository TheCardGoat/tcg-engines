import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { poisedRearguard } from "./poised-rearguard.ts";

/** @covers qso7cbzrky-a2 */
describe("Poised Rearguard — Class Bonus Equestrian wake", () => {
  for (const classBonus of [false, true]) {
    for (const horse of [false, true]) {
      it(`classBonus=${classBonus}, Horse ally=${horse}`, () => {
        const champion = createClassBonusTestChampion(
          poisedRearguard,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [poisedRearguard, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              field: horse ? [galesMare] : [],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(poisedRearguard, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        const ally = player.card(poisedRearguard, { zone: "field" });
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "qso7cbzrky-a2",
          ),
        ).toBe(classBonus);
        passEffectsStack(game);
        const wakes = classBonus && horse;
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!wakes);
        const target = opponent.card(champion, { zone: "field" });
        if (wakes) {
          player.declareAttack(ally, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
        } else {
          const before = game.state;
          expect(() => player.declareAttack(ally, target)).toThrow();
          expect(game.state).toEqual(before);
        }
      });
    }
  }
});
