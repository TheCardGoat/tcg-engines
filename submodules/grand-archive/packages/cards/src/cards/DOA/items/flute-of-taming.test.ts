import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
import { proveItemLevelAbility } from "../../../testing/item-level-ability.ts";
import { describe } from "vitest";
import { fluteOfTaming } from "./flute-of-taming.ts";

/** @covers y8fx8G64C9-a1 */
describe("Flute of Taming \u2014 resolution", () => {
  proveItemLevelAbility({ card: fluteOfTaming, abilityId: "y8fx8G64C9-a1", amount: 1 });
});

/** @covers y8fx8G64C9-a2 */
describe("Flute of Taming's chosen ally stat", () => {
  for (const mode of ["choice-1", "choice-2"])
    for (const ally of [woodlandSquirrels, grayWolf])
      for (const own of [true, false])
        it(`${mode} on ${own ? "own" : "opposing"} ${ally.slug}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(fluteOfTaming, false, "activation-discount"),
            2,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: { field: [fluteOfTaming, ally, blitzMage], "main-deck": [woodlandSquirrels] },
            },
            playerTwo: {
              champion,
              zones: { field: [ally, giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = (own ? p : q).card(ally),
            id = target.objectId;
          const stat = (property: "power" | "life") =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const power = ally === grayWolf ? 2 : 1,
            life = ally === grayWolf ? 2 : 1;
          const before = game.state;
          expect(() =>
            p.activateAbility(fluteOfTaming, "y8fx8G64C9-a2", {
              modeIds: [mode],
              targets: { "target-1": [p.card(blitzMage).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            p.activateAbility(fluteOfTaming, "y8fx8G64C9-a2", {
              modeIds: ["choice-1", "choice-2"],
              targets: { "target-1": [id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activateAbility(fluteOfTaming, "y8fx8G64C9-a2", {
            modeIds: [mode],
            targets: { "target-1": [id] },
          });
          expect(game.state.objects[p.card(fluteOfTaming).objectId]!.states.has("rested")).toBe(
            true,
          );
          expect(stat("power")).toBe(power);
          passEffectsStack(game);
          expect(stat("power")).toBe(power + Number(mode === "choice-1"));
          expect(stat("life")).toBe(life + Number(mode === "choice-2"));
          if (own) {
            p.declareAttack(target, q.card(champion));
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
              power + Number(mode === "choice-1"),
            );
          }
          advanceToMain(game, q.id);
          expect(stat("power")).toBe(power);
          expect(stat("life")).toBe(life);
        });
});
