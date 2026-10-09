import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { towerOfDis } from "./tower-of-dis.ts";
import { deliveryDroid } from "../allies/delivery-droid.ts";
import { acheronExpressOfficer } from "../allies/acheron-express-officer.ts";
import { siroccoOperative } from "../../P24/allies/sirocco-operative.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers I46x6lgLk8-a2 */
describe("Tower of Dis — both subtypes and controller scope", () => {
  for (const card of [deliveryDroid, acheronExpressOfficer, siroccoOperative, giantTortoise]) {
    it(`only boosts own DisCorp Automatons: ${card.slug}`, () => {
      const champion = createClassBonusTestChampion(towerOfDis, false, "activation-discount"),
        base = grandArchiveTestFace(card).stats;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [towerOfDis, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [
              card,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(towerOfDis),
        target = p.card(card);
      const stats = (bonus: number) => {
        for (const player of [p, q])
          for (const property of ["power", "life"] as const) {
            expect(
              deriveGrandArchiveNumericProperty(
                game.state.objects[player.card(card, { zone: "field" }).objectId]!,
                property,
                { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
              ),
            ).toBe(base[property]! + (player === p ? bonus : 0));
          }
      };
      stats(0);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      const bonus = card === deliveryDroid ? 1 : 0;
      stats(bonus);
      p.declareAttack(target, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(base.power! + bonus);
      advanceToMain(game, q.id);
      for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
        q.declareAttack(attacker, source);
        game.resolveCombatWithoutRetaliation();
      }
      expect(p.zone("graveyard")).toContainEqual(source);
      stats(0);
    });
  }
});
