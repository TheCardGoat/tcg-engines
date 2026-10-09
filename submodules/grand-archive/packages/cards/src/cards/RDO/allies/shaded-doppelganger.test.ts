import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { shadedDoppelganger } from "./shaded-doppelganger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enragedBoars } from "../../DOA/allies/enraged-boars.ts";
import { flamebreakChorus } from "../../FTC/actions/flamebreak-chorus.ts";
import { disorientingWinds } from "../../DOA/actions/disorienting-winds.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers Jr4Ivpcnst-a2 */
describe("Shaded Doppelganger — highest other allied base power", () => {
  for (const matching of [false, true])
    for (const formation of ["alone", "small", "large", "mixed", "copy"] as const)
      it(`class=${matching}, formation=${formation}`, () => {
        const base = enableAllTestElements(
          createClassBonusTestChampion(shadedDoppelganger, matching, "activation-discount"),
        );
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 8 } },
          },
        };
        const support =
          formation === "copy"
            ? [shadedDoppelganger]
            : formation === "mixed"
              ? [woodlandSquirrels, enragedBoars]
              : formation === "large"
                ? [enragedBoars]
                : formation === "small"
                  ? [woodlandSquirrels]
                  : [];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [shadedDoppelganger, ...support],
              hand: [
                enragedBoars,
                flamebreakChorus,
                disorientingWinds,
                ...Array.from({ length: 13 }, () => woodlandSquirrels),
              ],
              graveyard: [enragedBoars],
              banishment: [enragedBoars],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [enragedBoars] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.cards(shadedDoppelganger, { zone: "field" })[0]!,
          enemy = q.card(champion);
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
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
        const initial =
          formation === "alone" ? 1 : formation === "large" || formation === "mixed" ? 5 : 2;
        expect(power()).toBe(initial);
        if (formation !== "alone") {
          const other =
            formation === "copy"
              ? p.cards(shadedDoppelganger, { zone: "field" })[1]!
              : formation === "small"
                ? p.card(woodlandSquirrels, { zone: "field" })
                : p.card(enragedBoars, { zone: "field" });
          p.activate(flamebreakChorus, {
            reservePayment: pay(2),
            targets: { "target-1": [other.objectId] },
          });
          passEffectsStack(game);
          expect(power()).toBe(initial);
          p.activate(disorientingWinds, {
            reservePayment: pay(5),
            targets: { "target-1": [other.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[other.objectId]!.zone).toBe("hand");
          expect(power()).toBe(formation === "mixed" ? 2 : 1);
        }
        const entering = p.cards(enragedBoars, { zone: "hand" })[0]!;
        p.activate(entering, { reservePayment: pay(5) });
        passEffectsStack(game);
        expect(power()).toBe(5);
        p.declareAttack(source, enemy);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[enemy.objectId]!.damage).toBe(5);
      });
});
