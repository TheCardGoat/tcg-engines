import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { veltechGearHoarder } from "./veltech-gear-hoarder.ts";
import { stridetechW } from "../items/stridetech-w.ts";
import { signaltechOne } from "../items/signaltech-one.ts";
import { phantomVeil } from "../../AMB/items/phantom-veil.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { breakApart } from "../../P26/actions/break-apart.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 3EiA5HoKv2-a1 */
describe("VelTech Gear Hoarder — linked item count", () => {
  for (const opposing of [false, true])
    for (const count of [0, 1, 2]) {
      it(`counts only VelTech items on this host: opposing=${opposing}, count=${count}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(veltechGearHoarder, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: [veltechGearHoarder, giantTortoise, signaltechOne],
              "material-deck": [phantomVeil],
              memory: [woodlandSquirrels],
              hand: [
                breakApart,
                ...Array.from({ length: count + 1 }, () => stridetechW),
                ...Array.from({ length: 2 * (count + 1) + 3 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [veltechGearHoarder],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = opposing ? q : p,
          other = opposing ? p : q,
          host = owner.card(veltechGearHoarder);
        const stats = (bonus: number) => {
          for (const [id, expected] of [
            [host.objectId, bonus],
            [other.card(veltechGearHoarder).objectId, 0],
          ] as const)
            for (const property of ["power", "life"] as const) {
              expect(
                deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
                  program: game.program,
                  state: game.state,
                  controllerId: owner.id,
                  bindings: {},
                }),
              ).toBe((property === "power" ? 1 : 3) + expected);
            }
        };
        p.materialize(phantomVeil, { targets: { "intrinsic-link-target": [host.objectId] } });
        passEffectsStack(game);
        advanceToMain(game, p.id);
        stats(0);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(p.cards(stridetechW, { zone: "hand" })[0]!, {
          reservePayment: pay(2),
          targets: { "intrinsic-link-target": [p.card(giantTortoise).objectId] },
        });
        passEffectsStack(game);
        stats(0);
        const linked = [];
        for (let i = 0; i < count; i++) {
          const item = p.cards(stridetechW, { zone: "hand" })[0]!;
          linked.push(item);
          p.activate(item, {
            reservePayment: pay(2),
            targets: { "intrinsic-link-target": [host.objectId] },
          });
          passEffectsStack(game);
          stats(i + 1);
        }
        if (opposing) advanceToMain(game, q.id);
        owner.declareAttack(host, other.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[other.card(champion).objectId]!.damage).toBe(1 + count);
        if (count) {
          if (opposing) advanceToMain(game, p.id);
          p.activate(breakApart, {
            reservePayment: pay(3),
            targets: { "target-1": [linked[0]!.objectId] },
          });
          passEffectsStack(game);
          expect(p.zone("graveyard")).toContainEqual(linked[0]);
          stats(count - 1);
        }
      });
    }
});
