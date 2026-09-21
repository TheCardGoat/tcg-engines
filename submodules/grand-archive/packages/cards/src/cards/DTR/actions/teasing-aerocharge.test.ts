import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { teasingAerocharge } from "./teasing-aerocharge.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers 6lkv3tu69l-a1 @covers 6lkv3tu69l-a2 */
describe("Teasing Aerocharge — suppression before optional loading", () => {
  for (const own of [false, true])
    for (const load of [false, true])
      it(`suppresses ${own ? "own" : "opposing"} ally then load=${load}`, () => {
        const champion = createClassBonusTestChampion(
          teasingAerocharge,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
              hand: [teasingAerocharge, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream, woodlandSquirrels],
              graveyard: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q;
        const target = owner.card(woodlandSquirrels, { zone: "field" }),
          source = p.card(teasingAerocharge),
          host = p.cards(trivariateDream)[1]!;
        const incarnation = game.state.objects[target.objectId]!.incarnation;
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [
          q.card(champion),
          q.card(trivariateDream),
          q.card(woodlandSquirrels, { zone: "graveyard" }),
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(source, { targets: { "target-1": [invalid.objectId] }, reservePayment }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { targets: { "target-1": [target.objectId] }, reservePayment });
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        if (load) {
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        }
        for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        expect(game.state.objects[target.objectId]!.controllerId).toBe(owner.id);
        expect(game.state.objects[target.objectId]!.incarnation).toBeGreaterThan(incarnation);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
        advanceToMain(game, q.id);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
      });
});
