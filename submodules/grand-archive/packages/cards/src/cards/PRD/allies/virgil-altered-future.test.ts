import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { virgilAlteredFuture } from "./virgil-altered-future.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { flowerbud } from "../../HVN/tokens/flowerbud.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { firetunedAutomaton } from "../../ALC/allies/firetuned-automaton.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers xdgpdcD33h-a2 */
describe("Virgil, Altered Future — level-gated Powercell cap", () => {
  for (const level of [0, 1, 2])
    for (const count of [0, 1, 2, 3, 5])
      for (const opposing of [0, 3])
        for (const remove of [false, true]) {
          it(`level=${level}, Powercells=${count}, opposing=${opposing}, sacrifice=${remove}`, () => {
            const champion = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(virgilAlteredFuture, false, "activation-discount"),
              ),
              level,
            );
            const cells = (n: number) => Array.from({ length: n }, () => powercell);
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [
                    virgilAlteredFuture,
                    firetunedAutomaton,
                    flowerbud,
                    flowerbud,
                    ...cells(count),
                  ],
                  hand: Array.from({ length: 6 }, () => woodlandSquirrels),
                },
              },
              playerTwo: { champion, zones: { field: cells(opposing) } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(virgilAlteredFuture),
              foe = q.card(champion);
            const stat = (property: "power" | "life") =>
              deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
                program: game.program,
                state: game.state,
                controllerId: p.id,
                bindings: {},
              });
            const expected = (n: number) => 2 + (level >= 1 ? Math.min(n, 2) : 0);
            expect(stat("power")).toBe(expected(count));
            expect(stat("life")).toBe(expected(count));
            p.declareAttack(source, foe);
            let remaining = count;
            if (remove)
              for (const cell of p.cards(powercell, { zone: "field" })) {
                p.activateAbility(cell, "qzzadf9q1v-a1", {
                  reservePayment: [
                    {
                      kind: "card",
                      cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                    },
                  ],
                  targets: { "target-1": [p.card(firetunedAutomaton).objectId] },
                });
                remaining--;
                expect(stat("power")).toBe(expected(remaining));
                expect(stat("life")).toBe(expected(remaining));
                passEffectsStack(game);
              }
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[foe.objectId]!.damage).toBe(expected(remaining));
          });
        }
});
