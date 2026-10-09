import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { dusklightCommunion } from "./dusklight-communion.ts";
import { arisannaAstralZenith } from "../../ALC/champions/arisanna-astral-zenith.ts";
import { dianaCursebreaker } from "../../ALC/champions/diana-cursebreaker.ts";
import { chasingShadows } from "../../RDO/phantasias/chasing-shadows.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { disenchant } from "../../P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 5upufyoz23-a1 @covers 5upufyoz23-a2 */
describe("Dusklight Communion — elemental payment and entry branches", () => {
  for (const matching of [false, true])
    for (const astra of [false, true])
      for (const targetChoice of ["none", "own", "opponent", "source"] as const)
        it(`class=${matching}, astra=${astra}, target=${targetChoice}`, () => {
          const champion = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(dusklightCommunion, matching, "activation-discount"),
            ),
            3,
          );
          const material = astra ? arisannaAstralZenith : dianaCursebreaker;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  dusklightCommunion,
                  disenchant,
                  material,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                "material-deck": [arisannaAstralZenith, dianaCursebreaker, trainingSword],
                graveyard: [material],
                memory: [material],
                banishment: [astra ? dianaCursebreaker : arisannaAstralZenith],
                field: [chasingShadows],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [chasingShadows, woodlandSquirrels], "material-deck": [material] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(dusklightCommunion),
            paid = p.card(material, { zone: "material-deck" });
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const level = (player: typeof p) =>
            deriveGrandArchiveNumericProperty(
              game.state.objects[player.card(champion).objectId]!,
              "level",
              { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
            );
          expect(level(p)).toBe(3);
          expect(level(q)).toBe(3);
          const before = game.state;
          for (const ids of [
            [],
            [paid.objectId, paid.objectId],
            [p.card(trainingSword).objectId],
            [q.card(material).objectId],
            [p.card(material, { zone: "hand" }).objectId],
            [p.card(material, { zone: "graveyard" }).objectId],
            [p.card(material, { zone: "memory" }).objectId],
          ]) {
            expect(() =>
              p.activate(source, { reservePayment: pay(3), costSelections: [ids] }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(source, { reservePayment: pay(2), costSelections: [[paid.objectId]] }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: pay(3), costSelections: [[paid.objectId]] });
          expect(game.state.objects[paid.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          const target =
            targetChoice === "source"
              ? source
              : targetChoice === "own"
                ? p.card(chasingShadows)
                : q.card(chasingShadows);
          if (game.state.decision?.kind === "announce-triggered-ability") {
            const prior = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-phantasia": [q.card(woodlandSquirrels).objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(prior);
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-phantasia": targetChoice === "none" ? [] : [target.objectId] },
            });
          }
          passEffectsStack(game);
          for (const ref of [source, p.card(chasingShadows), q.card(chasingShadows)])
            expect(game.state.objects[ref.objectId]!.zone).toBe(
              astra && targetChoice !== "none" && ref.objectId === target.objectId
                ? "graveyard"
                : "field",
            );
          expect(level(p)).toBe(astra ? 3 : 2);
          expect(level(q)).toBe(astra ? 3 : 2);
          if (!astra) {
            p.activate(disenchant, {
              reservePayment: pay(2),
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
            expect(level(p)).toBe(3);
            expect(level(q)).toBe(3);
          }
        });
});

import { surgingObstruction } from "../../RDO/actions/surging-obstruction.ts";
describe("Dusklight Communion — payment persists through negation", () => {
  for (const matching of [false, true])
    for (const astra of [false, true])
      it(`class=${matching}, astra=${astra}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(dusklightCommunion, matching, "activation-discount"),
        );
        const material = astra ? arisannaAstralZenith : dianaCursebreaker;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [dusklightCommunion, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              "material-deck": [material],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [surgingObstruction, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [chasingShadows],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(dusklightCommunion),
          paid = p.card(material);
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels)
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          costSelections: [[paid.objectId]],
        });
        const target = game.state.stack.at(-1)!.id;
        p.pass();
        q.activate(surgingObstruction, {
          reservePayment: q
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-stack-item": [target] },
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[paid.objectId]!.zone).toBe("banishment");
        expect(p.zone("memory")).toHaveLength(3);
        expect(game.state.objects[q.card(chasingShadows).objectId]!.zone).toBe("field");
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
      });
});
