import { describe } from "vitest";
import { inspiringAethercharge } from "./inspiring-aethercharge.ts";
import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers fPtTKILV7f-a2 */
describe("inspiring-aethercharge — optional Aetherwing loading", () => {
  proveOptionalAetherwingLoad(inspiringAethercharge);
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
/** @covers fPtTKILV7f-a1 */
describe("Inspiring Aethercharge — existing allied power", () => {
  for (const matching of [false, true])
    for (const copies of [1, 2])
      for (const returned of [false, true])
        it(`class=${matching}, copies=${copies}, reentry=${returned}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(inspiringAethercharge, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, woodlandSquirrels],
                hand: [
                  reclaim,
                  ...Array.from({ length: copies }, () => inspiringAethercharge),
                  ...Array.from({ length: 11 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            ally = p.card(giantTortoise),
            other = p.card(woodlandSquirrels, { zone: "field" });
          const power = (id: typeof ally.objectId) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const source of p.cards(inspiringAethercharge, { zone: "hand" })) {
            p.activate(source, { reservePayment: pay(2) });
            passEffectsStack(game);
          }
          expect(power(ally.objectId)).toBe(1 + copies);
          expect(power(other.objectId)).toBe(1 + copies);
          expect(power(q.card(giantTortoise).objectId)).toBe(1);
          if (returned) {
            p.activate(reclaim, {
              reservePayment: pay(2),
              targets: { "target-1": [ally.objectId] },
            });
            passEffectsStack(game);
            p.activate(ally, { reservePayment: pay(4) });
            passEffectsStack(game);
          }
          const late = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
          p.activate(late);
          passEffectsStack(game);
          expect(power(late.objectId)).toBe(1);
          p.declareAttack(ally, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]?.damage).toBe(
            returned ? 1 : 1 + copies,
          );
          advanceToMain(game, p.id, game.state.turn.number);
          expect(power(ally.objectId)).toBe(1);
          expect(power(other.objectId)).toBe(1);
          expect(power(late.objectId)).toBe(1);
        });
});
