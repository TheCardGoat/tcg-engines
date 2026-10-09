import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { thievingCut } from "./thieving-cut.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { intangibleGeist } from "../../DOA/allies/intangible-geist.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 7t9m4muq2r-a1
 * @covers 7t9m4muq2r-a2
 */
describe("Thieving Cut", () => {
  for (const mode of ["missing", "declined", "prepared"])
    for (const hit of [false, true])
      it(`draws only on a prepared hit, ${mode}, hit=${hit}`, () => {
        const champion = createClassBonusTestChampion(thievingCut, false, "activation-discount");
        const opponent = createClassBonusTestChampion(intangibleGeist, true, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                thievingCut,
                ...(mode === "missing" ? [] : [acceptedContract]),
                ...Array.from({ length: mode === "missing" ? 2 : 7 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: opponent, zones: { field: [intangibleGeist] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          target = q.card(hit ? opponent : intangibleGeist);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(thievingCut, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            prepareAbilityIndexes: [0],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (mode !== "missing") {
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
        }
        const drawn = p.zone("main-deck")[0]!;
        p.activate(thievingCut, {
          reservePayment: pay(2),
          attackAttackerId: hero.objectId,
          ...(mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
          mode === "missing" ? 0 : mode === "prepared" ? 2 : 3,
        );
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Resolve Thieving Cut");
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(hit ? 3 : 0);
        expect(p.zone("hand")).toEqual(hit && mode === "prepared" ? [drawn] : []);
      });
});
