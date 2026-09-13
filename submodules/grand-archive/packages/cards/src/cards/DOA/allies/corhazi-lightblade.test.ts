import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { resolveCriticalCombat } from "../../../testing/critical-combat.ts";
import { corhaziLightblade } from "./corhazi-lightblade.ts";
/** @covers 2Ch1Gp3jEL-a1 */
describe("Corhazi Lightblade's random memory reveal and temporary critical", () => {
  for (const classBonus of [false, true])
    for (const memory of ["empty", "norm", "luxem"] as const)
      for (const pay of [false, true])
        it(`class=${classBonus}, memory=${memory}, pay=${pay}`, () => {
          const champion = createClassBonusTestChampion(
              corhaziLightblade,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [corhaziLightblade, giantTortoise],
                  memory:
                    memory === "empty"
                      ? []
                      : memory === "norm"
                        ? [woodlandSquirrels, giantTortoise]
                        : [corhaziLightblade, corhaziLightblade],
                  graveyard: [corhaziLightblade],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [woodlandSquirrels, giantTortoise],
                  memory: [corhaziLightblade],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = q.card(champion),
            source = p.card(corhaziLightblade, { zone: "field" }),
            beforeMemory = p.zone("memory");
          p.declareAttack(giantTortoise, hero);
          game.resolveCombatWithoutRetaliation();
          p.declareAttack(source, hero);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          const reveals = game.state.eventHistory.filter((e) => e.type === "card-revealed");
          expect(reveals).toHaveLength(classBonus && memory !== "empty" ? 1 : 0);
          for (const event of reveals)
            expect(beforeMemory.map((c) => c.objectId)).toContain(event.objectId);
          expect(p.zone("memory")).toEqual(beforeMemory);
          const enabled = classBonus && memory === "luxem";
          resolveCriticalCombat(game, { amount: 1, offered: enabled, pay });
          const first = 1 + (enabled && !pay ? 4 : 2);
          expect(game.state.objects[hero.objectId]!.damage).toBe(first);
          expect(q.zone("hand")).toHaveLength(2 - (enabled && pay ? 1 : 0));
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
          expect(p.zone("memory")).toHaveLength(0);
          p.declareAttack(source, hero);
          passEffectsStack(game);
          resolveCriticalCombat(game, { amount: 1, offered: false, pay: false });
          expect(game.state.objects[hero.objectId]!.damage).toBe(first + 2);
        });
});
