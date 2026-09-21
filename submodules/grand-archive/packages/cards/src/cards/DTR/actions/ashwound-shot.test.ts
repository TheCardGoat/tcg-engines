import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { ashwoundShot } from "./ashwound-shot.ts";
import { embercryptBurn } from "./embercrypt-burn.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers v9zfscdxzn-a1 @covers v9zfscdxzn-a2 */
describe("Ashwound Shot — opponent-only class recovery lock and loading", () => {
  for (const matching of [false, true])
    for (const load of [false, true])
      it(`forbids recovery only with class=${matching}, load=${load}`, () => {
        const champion = createClassBonusTestChampion(
          ashwoundShot,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword, potionOfHealing],
              hand: [ashwoundShot, embercryptBurn, woodlandSquirrels, woodlandSquirrels],
              graveyard: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream, potionOfHealing, potionOfHealing],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(ashwoundShot),
          host = p.cards(trivariateDream)[1]!;
        p.activate(embercryptBurn, {
          targets: { "target-card": [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(2);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        if (matching) {
          for (const invalid of [p.id, q.card(champion).objectId]) {
            const before = game.state;
            expect(() => p.activate(source, { targets: { "target-player": [invalid] } })).toThrow();
            expect(game.state).toEqual(before);
          }
        }
        p.activate(source, matching ? { targets: { "target-player": [q.id] } } : {});
        passEffectsStack(game);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        p.pass();
        q.activateAbility(q.cards(potionOfHealing, { zone: "field" })[0]!, "qtb31x97n2-a2");
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(matching ? 2 : 0);
        expect(q.cards(potionOfHealing, { zone: "graveyard" })).toHaveLength(1);
        p.activateAbility(p.card(potionOfHealing), "qtb31x97n2-a2");
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        if (load) {
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            (matching ? 2 : 0) + 2,
          );
        }
        advanceToMain(game, q.id);
        q.activateAbility(q.card(potionOfHealing, { zone: "field" }), "qtb31x97n2-a2");
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        expect(q.cards(potionOfHealing, { zone: "graveyard" })).toHaveLength(2);
      });
});
