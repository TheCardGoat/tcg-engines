import { proveRestedEntry } from "../../../testing/rested-entry.ts";
import { describe } from "vitest";
import { poisonedDagger } from "./poisoned-dagger.ts";

/** @covers 0D6AfZyKXh-a1 */
describe("Poisoned Dagger \u2014 resolution", () => {
  proveRestedEntry({ card: poisonedDagger, cost: { kind: "memory", amount: 0 } });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0D6AfZyKXh-a2 */
describe("Poisoned Dagger's paid damage and subsequent amplification", () => {
  for (const classBonus of [false, true])
    for (const recipient of ["own-ally", "opposing-champion"] as const)
      it(`class=${classBonus}, target=${recipient}`, () => {
        const champion = createClassBonusTestChampion(
            poisonedDagger,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, woodlandSquirrels],
                "material-deck": [poisonedDagger],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          dagger = p.card(poisonedDagger),
          target = recipient === "own-ally" ? p.card(giantTortoise) : foe;
        p.materialize(poisonedDagger);
        passEffectsStack(game);
        const rested = game.state;
        expect(() =>
          p.activateAbility(dagger, "0D6AfZyKXh-a2", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(rested);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        const before = game.state;
        expect(() =>
          p.activateAbility(dagger, "0D6AfZyKXh-a2", {
            targets: { "target-1": [dagger.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(dagger, "0D6AfZyKXh-a2", { targets: { "target-1": [target.objectId] } });
        expect(p.card(poisonedDagger, { zone: "banishment" }).objectId).toBe(dagger.objectId);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        expect(() =>
          p.activateAbility(dagger, "0D6AfZyKXh-a2", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        p.declareAttack(woodlandSquirrels, recipient === "own-ally" ? foe : target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          recipient === "own-ally" ? 1 : classBonus ? 3 : 2,
        );
        advanceToMain(game, q.id);
        q.declareAttack(woodlandSquirrels, recipient === "own-ally" ? target : hero);
        game.resolveCombatWithoutRetaliation();
        expect(
          game.state.objects[(recipient === "own-ally" ? target : hero).objectId]!.damage,
        ).toBe(1);
      });
});
