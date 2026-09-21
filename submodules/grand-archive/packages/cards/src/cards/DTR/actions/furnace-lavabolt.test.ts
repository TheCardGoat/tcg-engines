import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { furnaceLavabolt } from "./furnace-lavabolt.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers ru4g75uz1i-a1 @covers ru4g75uz1i-a2 @covers ru4g75uz1i-a3 */
describe("Furnace Lavabolt — class discount, symmetric draw and loading", () => {
  for (const matching of [false, true])
    for (const mode of ["load", "decline", "no-host"] as const)
      it(`pays its class-dependent cost (${matching}) and draws before ${mode}`, () => {
        const champion = createClassBonusTestChampion(
            furnaceLavabolt,
            matching,
            "activation-discount",
          ),
          cost = matching ? 2 : 3;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [furnaceLavabolt, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: [
                trainingSword,
                ...(mode === "no-host" ? [] : [trivariateDream, trivariateDream]),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(furnaceLavabolt),
          tops = [p.zone("main-deck")[0]!, q.zone("main-deck")[0]!];
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: reservePayment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment });
        expect(p.zone("hand")).toHaveLength(0);
        expect(q.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual([tops[0]]);
        expect(q.zone("hand")).toEqual([tops[1]]);
        expect(p.zone("main-deck")).toHaveLength(1);
        expect(q.zone("main-deck")).toHaveLength(1);
        if (mode === "no-host") {
          if (game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        } else {
          const host = p.cards(trivariateDream)[1]!;
          finishOptionalAetherwingLoad(game, source.objectId, host.objectId, mode === "load", [
            q.card(trivariateDream).objectId,
            p.card(trainingSword).objectId,
          ]);
          if (mode === "load") {
            p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
            expect(game.state.objects[source.objectId]!.zone).toBe("intent");
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          }
        }
      });
});
