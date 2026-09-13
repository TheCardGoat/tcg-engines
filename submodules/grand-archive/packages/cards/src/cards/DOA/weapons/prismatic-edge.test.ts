import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { windriderMage } from "../allies/windrider-mage.ts";
import { fireball } from "../actions/fireball.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { prismaticEdge } from "./prismatic-edge.ts";
/** @covers FxYwR2azTt-a1 */
for (const bonus of [false, true])
  for (const own of [false, true])
    for (let mask = 0; mask < 8; mask++)
      it(`Prismatic Edge class=${bonus},revealed owner=${own},elements=${mask}`, () => {
        const champion = createClassBonusTestChampion(prismaticEdge, bonus, "activation-discount"),
          selected = [
            ...(mask & 1 ? [fireball] : []),
            ...(mask & 2 ? [giantTortoise] : []),
            ...(mask & 4 ? [windriderMage] : []),
          ];
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              memory: [
                woodlandSquirrels,
                woodlandSquirrels,
                ...(own ? selected.flatMap((c) => [c, c, c]) : []),
              ],
              "material-deck": [prismaticEdge],
              "main-deck": [woodlandSquirrels, giantTortoise],
            },
          },
          playerTwo: {
            champion,
            zones: {
              memory: own ? [woodlandSquirrels, woodlandSquirrels] : selected,
              field: [trainingSword, giantTortoise],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          foe = q.card(champion),
          top = p.zone("main-deck")[0]!,
          qMemory = q.zone("memory").map((c) => c.objectId);
        p.materialize(prismaticEdge);
        expect(p.zone("banishment")).toHaveLength(2);
        const retained = p.zone("memory").map((c) => c.objectId);
        passEffectsStack(game);
        if (bonus && mask & 1) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(trainingSword).objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [foe.objectId]);
          passEffectsStack(game);
        }
        expect(game.state.objects[foe.objectId]!.damage).toBe(bonus && mask & 1 ? 3 : 0);
        expect(game.state.objects[top.objectId]!.zone).toBe(
          bonus && mask & 2 ? "hand" : "main-deck",
        );
        expect(q.zone("banishment")).toHaveLength(bonus && mask & 4 ? 1 : 0);
        for (const c of q.zone("banishment")) expect(qMemory).toContain(c.objectId);
        expect(p.zone("memory").map((c) => c.objectId)).toEqual(retained);
        expect(p.card(prismaticEdge, { zone: "field" })).toBeDefined();
      });
