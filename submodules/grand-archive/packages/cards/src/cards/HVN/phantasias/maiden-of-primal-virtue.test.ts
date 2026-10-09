import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { maidenOfPrimalVirtue } from "./maiden-of-primal-virtue.ts";
import { acerbica } from "../tokens/acerbica.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { disenchant } from "../../P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers hbt487eux7-a1 */
describe("Maiden of Primal Virtue counts itself and only controlled field phantasias", () => {
  for (const count of [0, 1, 3])
    for (const opposingCount of [0, 2])
      for (const removeOwn of count ? [false, true] : [false])
        it(`own=${count}, opposing=${opposingCount}, remove own=${removeOwn}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(maidenOfPrimalVirtue, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [woodlandSquirrels, ...Array.from({ length: count }, () => acerbica)],
                hand: [
                  maidenOfPrimalVirtue,
                  maidenOfPrimalVirtue,
                  disenchant,
                  disenchant,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                graveyard: [maidenOfPrimalVirtue],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [
                  maidenOfPrimalVirtue,
                  ...Array.from({ length: opposingCount }, () => acerbica),
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const [first, second] = p.cards(maidenOfPrimalVirtue, { zone: "hand" });
          if (!first || !second) throw new Error("Missing Maiden copies");
          const foe = q.card(maidenOfPrimalVirtue);
          const stats = (id: typeof first.objectId, n: number) => {
            for (const property of ["power", "life"] as const)
              expect(
                deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
                  program: game.program,
                  state: game.state,
                  controllerId: p.id,
                  bindings: {},
                }),
              ).toBe(n);
          };
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          p.activate(first, { reservePayment: pay(3) });
          passEffectsStack(game);
          expect(game.state.objects[first.objectId]!.zone).toBe("field");
          stats(first.objectId, count + 1);
          stats(foe.objectId, opposingCount + 1);
          p.activate(second, { reservePayment: pay(3) });
          passEffectsStack(game);
          stats(first.objectId, count + 2);
          stats(second.objectId, count + 2);
          stats(foe.objectId, opposingCount + 1);
          const destroy = (id: typeof first.objectId) => {
            p.activate(p.cards(disenchant, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-1": [id] },
            });
            passEffectsStack(game);
          };
          destroy(second.objectId);
          stats(first.objectId, count + 1);
          stats(foe.objectId, opposingCount + 1);
          destroy(removeOwn ? p.cards(acerbica, { zone: "field" })[0]!.objectId : foe.objectId);
          const finalPower = count + 1 - (removeOwn ? 1 : 0);
          stats(first.objectId, finalPower);
          expect(
            game.state.objects[p.card(woodlandSquirrels, { zone: "field" }).objectId]!.zone,
          ).toBe("field");
          p.declareAttack(first, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(finalPower);
        });
});
