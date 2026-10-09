import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aquatechBladeX } from "./aquatech-blade-x.ts";
import { capacitanceXPsycho } from "./capacitance-x-psycho.ts";
import { cooktechMixer } from "../items/cooktech-mixer.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers WI5oMtzP3W-a1 */
describe("AquaTech Blade X — controlled VelTech item materialization discount", () => {
  for (const matching of [false, true])
    for (const scenario of [
      "none",
      "one",
      "two",
      "opponent",
      "weapon",
      "other-item",
      "hand",
      "graveyard",
      "banishment",
    ])
      for (const memory of [0, 1, 2]) {
        it(`class=${matching}, condition=${scenario}, memory=${memory}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(aquatechBladeX, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                "material-deck": [aquatechBladeX],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                field:
                  scenario === "one"
                    ? [cooktechMixer]
                    : scenario === "two"
                      ? [cooktechMixer, cooktechMixer]
                      : scenario === "weapon"
                        ? [capacitanceXPsycho]
                        : scenario === "other-item"
                          ? [powercell]
                          : [],
                hand: scenario === "hand" ? [cooktechMixer] : [],
                graveyard: scenario === "graveyard" ? [cooktechMixer] : [],
                banishment: scenario === "banishment" ? [cooktechMixer] : [],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: scenario === "opponent" ? [cooktechMixer] : [],
                memory: [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(aquatechBladeX),
            before = game.state,
            ownMemory = p.zone("memory"),
            opponentMemory = q.zone("memory"),
            oldBanishment = p.zone("banishment").length;
          const cost = scenario === "one" || scenario === "two" ? 0 : 1;
          if (memory < cost) {
            expect(() => p.materialize(source)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.materialize(source);
          expect(p.zone("memory")).toHaveLength(memory - cost);
          expect(p.zone("banishment")).toHaveLength(oldBanishment + cost);
          expect(q.zone("memory")).toEqual(opponentMemory);
          for (const ref of ownMemory)
            expect(["memory", "banishment"]).toContain(game.state.objects[ref.objectId]!.zone);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[source.objectId]!.counters.durability).toBe(3);
        });
      }
});

import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { tempestDownfall } from "../../MRC/actions/tempest-downfall.ts";
import { firetunedAutomaton } from "../../ALC/allies/firetuned-automaton.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
/** @covers WI5oMtzP3W-a2 */
describe("AquaTech Blade X — Cascade and floating-memory payment", () => {
  for (const matching of [false, true]) {
    it(`class=${matching}, all printed stages and exhausted cascade`, () => {
      const champion = enableAllTestElements(
          createClassBonusTestChampion(aquatechBladeX, matching, "activation-discount"),
        ),
        deck = Array.from({ length: 8 }, () => woodlandSquirrels);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [aquatechBladeX],
            graveyard: [reclaim, reclaim, reclaim, reclaim, firetunedAutomaton, woodlandSquirrels],
            hand: [
              reclaim,
              ...Array.from({ length: 4 }, () => tempestDownfall),
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            "main-deck": deck,
          },
        },
        playerTwo: { champion, zones: { graveyard: [reclaim], "main-deck": deck } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(aquatechBladeX),
        hero = p.card(champion),
        foe = q.card(champion);
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      for (const spell of p.cards(tempestDownfall, { zone: "hand" })) {
        p.activate(spell, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(12);
      const payments = p.cards(reclaim, { zone: "graveyard" });
      const before = game.state;
      for (const ids of [
        [],
        [q.card(reclaim).objectId],
        [p.card(reclaim, { zone: "hand" }).objectId],
        [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
        [p.card(firetunedAutomaton).objectId],
        [payments[0]!.objectId, payments[1]!.objectId],
      ]) {
        expect(() =>
          p.activateAbility(source, "WI5oMtzP3W-a2", { costSelections: [ids] }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      if (!matching) {
        expect(() =>
          p.activateAbility(source, "WI5oMtzP3W-a2", { costSelections: [[payments[0]!.objectId]] }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      let totalDamage = 0;
      for (let stage = 1; stage <= 4; stage++) {
        if (stage > 1) advanceToMain(game, p.id, game.state.turn.number);
        expect(power()).toBe(1);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
        p.activateAbility(source, "WI5oMtzP3W-a2", {
          costSelections: [[payments[stage - 1]!.objectId]],
        });
        expect(game.state.objects[payments[stage - 1]!.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        if (stage < 4) {
          const paid = game.state;
          expect(() =>
            p.activateAbility(source, "WI5oMtzP3W-a2", {
              costSelections: [[payments[stage]!.objectId]],
            }),
          ).toThrow();
          expect(game.state).toEqual(paid);
        }
        passEffectsStack(game);
        const expectedPower = stage === 1 ? 4 : stage === 3 ? 6 : 1;
        expect(power()).toBe(expectedPower);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          stage === 1 ? 12 : stage === 2 ? 8 : 3,
        );
        if (stage !== 2) {
          p.declareAttack(hero, foe, { weaponIds: [source.objectId] });
          game.resolveCombatWithoutRetaliation();
          totalDamage += expectedPower;
          expect(game.state.objects[foe.objectId]!.damage).toBe(totalDamage);
        }
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    });
  }
});
