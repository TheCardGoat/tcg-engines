import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aethericReforging } from "./aetheric-reforging.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers yd56vkebu9-a1 */
describe("Aetheric Reforging — optional graveyard target and loading", () => {
  for (const targetOwner of ["none", "own", "opponent"] as const)
    for (const load of [false, true])
      it(`banishes ${targetOwner} target and ${load ? "loads" : "declines loading"}`, () => {
        const champion = createClassBonusTestChampion(
          aethericReforging,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [aethericReforging, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [trivariateDream, trivariateDream, trainingSword],
              graveyard: [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream],
              graveyard: [woodlandSquirrels],
              hand: [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(aethericReforging),
          host = p.cards(trivariateDream)[1]!;
        const target = (targetOwner === "own" ? p : q).card(woodlandSquirrels, {
          zone: "graveyard",
        });
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const ids of [
          [p.card(trainingSword).objectId],
          [q.card(woodlandSquirrels, { zone: "hand" }).objectId],
          [
            p.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
            q.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
          ],
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(source, { reservePayment, targets: { "target-card": ids } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, {
          reservePayment,
          targets: { "target-card": targetOwner === "none" ? [] : [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          targetOwner === "none" ? "graveyard" : "banishment",
        );
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answerDecision(game, "resolve-optional-effect", load);
        passEffectsStack(game);
        if (load) {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          for (const invalid of [q.card(trivariateDream), p.card(trainingSword)]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [host.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("loaded");
          expect(game.state.objects[source.objectId]!.hostId).toBe(host.objectId);
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          expect(game.state.objects[source.objectId]!.zone).toBe("intent");
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(1);
      });
});
