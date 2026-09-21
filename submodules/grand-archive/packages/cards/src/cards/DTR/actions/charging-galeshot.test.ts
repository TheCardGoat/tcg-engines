import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chargingGaleshot } from "./charging-galeshot.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers qu9wwsi17b-a1 */
describe("Charging Galeshot — only attacking allies return to owner's memory", () => {
  for (const own of [false, true])
    for (const load of [false, true])
      it(`returns ${own ? "own" : "opposing"} attacker, load=${load}`, () => {
        const champion = createClassBonusTestChampion(
          chargingGaleshot,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
              hand: [chargingGaleshot, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q,
          foe = own ? q : p;
        const attacker = owner.card(woodlandSquirrels, { zone: "field" }),
          source = p.card(chargingGaleshot),
          host = p.cards(trivariateDream)[1]!;
        owner.declareAttack(attacker, foe.card(champion));
        if (!own) q.pass();
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [
          foe.card(woodlandSquirrels, { zone: "field" }),
          owner.card(champion),
          host,
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(source, { targets: { "target-1": [invalid.objectId] }, reservePayment }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { targets: { "target-1": [attacker.objectId] }, reservePayment });
        expect(game.state.objects[attacker.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[attacker.objectId]!.zone).toBe("memory");
        expect(owner.zone("memory").some((c) => c.objectId === attacker.objectId)).toBe(true);
        expect(foe.zone("memory").some((c) => c.objectId === attacker.objectId)).toBe(false);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(0);
        if (load) {
          advanceToMain(game, p.id);
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        }
      });
});
