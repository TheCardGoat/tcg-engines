import { describe } from "vitest";
import { blancheShelteringSaint } from "./blanche-sheltering-saint.ts";
import { proveLevelFastActivation } from "../../../testing/level-fast-activation.ts";
/** @covers 5k1vt1cn1t-a1 */
describe("blanche-sheltering-saint — Level 2 Fast Activation", () =>
  proveLevelFastActivation(blancheShelteringSaint));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
/** @covers 5k1vt1cn1t-a2 */
describe("Blanche — current memory prevents each noncombat hit to another controlled unit", () => {
  for (const memory of [0, 1, 2, 3])
    for (const recipient of ["self", "ally", "champion", "opponent"] as const)
      for (const kind of recipient === "opponent"
        ? (["skill", "unpreventable"] as const)
        : (["skill", "unpreventable", "combat"] as const))
        it(`memory=${memory}, recipient=${recipient}, damage=${kind}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(blancheShelteringSaint, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [blancheShelteringSaint, giantTortoise],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise, giantTortoise],
                hand: [
                  plantedExplosive,
                  plantedExplosive,
                  sparkAlight,
                  sparkAlight,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target =
              recipient === "self"
                ? p.card(blancheShelteringSaint)
                : recipient === "ally"
                  ? p.card(giantTortoise)
                  : recipient === "champion"
                    ? p.card(champion)
                    : q.cards(giantTortoise)[0]!,
            raw = kind === "combat" ? 1 : 2,
            expected =
              kind === "skill" && (recipient === "ally" || recipient === "champion")
                ? Math.max(0, raw - memory)
                : raw;
          const life = recipient === "self" ? 2 : recipient === "champion" ? 20 : 6;
          for (let hit = 1; hit <= 2; hit++) {
            const start = game.state.eventHistory.length;
            if (kind === "combat") {
              q.declareAttack(q.cards(giantTortoise)[hit - 1]!, target);
              game.resolveCombatWithoutRetaliation();
            } else {
              q.activate(
                q.cards(kind === "skill" ? plantedExplosive : sparkAlight, { zone: "hand" })[0]!,
                {
                  reservePayment: q
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .slice(0, 2)
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                  targets: { "target-1": [target.objectId] },
                },
              );
              passEffectsStack(game);
            }
            const damage = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0);
            expect(damage).toBe(expected);
            expect(p.zone("memory")).toHaveLength(memory);
            const dies = expected * hit >= life;
            expect(game.state.objects[target.objectId]!.zone).toBe(dies ? "graveyard" : "field");
            if (dies) break;
            expect(game.state.objects[target.objectId]!.damage).toBe(expected * hit);
          }
        });
  it("uses memory added by payment and continues after unpreventable damage", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(blancheShelteringSaint, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [blancheShelteringSaint],
          hand: [
            plantedExplosive,
            plantedExplosive,
            sparkAlight,
            ...Array.from({ length: 6 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      hero = p.card(champion);
    for (const [i, card] of [plantedExplosive, sparkAlight, plantedExplosive].entries()) {
      p.activate(p.cards(card, { zone: "hand" })[0]!, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [hero.objectId] },
      });
      expect(p.zone("memory")).toHaveLength((i + 1) * 2);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(i === 0 ? 0 : 2);
    }
  });
});
