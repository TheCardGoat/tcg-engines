import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { infernalManastreak } from "./infernal-manastreak.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers rovbfpf7al-a1 @covers rovbfpf7al-a2 */
describe("Infernal Manastreak — current champion distance and optional load", () => {
  for (const distance of ["none", "self", "opponent", "response"] as const)
    for (const targetKind of ["champion", "ally", "own-ally"] as const)
      it(`deals the distance-dependent damage to ${targetKind}, distance=${distance}`, () => {
        const champion = createClassBonusTestChampion(
          infernalManastreak,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword, giantTortoise],
              hand: [
                infernalManastreak,
                reposition,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
            },
          },
          playerTwo: { champion, zones: { field: [trivariateDream, giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(infernalManastreak),
          host = p.cards(trivariateDream)[1]!;
        const target =
          targetKind === "champion"
            ? q.card(champion)
            : (targetKind === "own-ally" ? p : q).card(giantTortoise);
        const becomeDistant = () =>
          p.activate(reposition, {
            targets: { "target-1": [(distance === "opponent" ? q : p).card(champion).objectId] },
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
        if (distance === "self" || distance === "opponent") {
          becomeDistant();
          passEffectsStack(game);
        }
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(source, { targets: { "target-1": [host.objectId] }, reservePayment }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { targets: { "target-1": [target.objectId] }, reservePayment });
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        if (distance === "response") becomeDistant();
        passEffectsStack(game);
        const increased = distance === "self" || distance === "response",
          damage = increased ? 3 : 2;
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        const untouched = (targetKind === "own-ally" ? q : p).card(giantTortoise);
        expect(game.state.objects[untouched.objectId]!.damage).toBe(0);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, increased, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        if (increased) {
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            (targetKind === "champion" ? damage : 0) + 2,
          );
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        }
      });
});
