import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { aethersEmbrace } from "./aethers-embrace.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { ghostHunter } from "../allies/ghost-hunter.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers wd7nuab7f3-a1 @covers wd7nuab7f3-a2 */
describe("Aether's Embrace — defending Ranger wake and combat stats", () => {
  for (const mode of [
    "defending-ranger",
    "nondefending-ranger",
    "defending-nonranger",
    "defending-champion",
  ] as const)
    for (const load of [false, true])
      it(`becomes distant, applies only the defending Ranger bonus (${mode}), load=${load}`, () => {
        const champion = createClassBonusTestChampion(aethersEmbrace, true, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream, trivariateDream, trainingSword, giantTortoise, ghostHunter],
              hand: [aethersEmbrace, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trivariateDream, trainingSword, giantTortoise, ghostHunter],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(aethersEmbrace),
          host = p.cards(trivariateDream)[1]!;
        const target =
          mode === "nondefending-ranger"
            ? p.card(ghostHunter)
            : q.card(
                mode === "defending-ranger"
                  ? ghostHunter
                  : mode === "defending-champion"
                    ? champion
                    : giantTortoise,
              );
        if (mode !== "nondefending-ranger") {
          q.declareAttack(
            target,
            p.card(champion),
            mode === "defending-champion" ? { weaponIds: [q.card(trainingSword).objectId] } : {},
          );
          game.resolveCombatWithoutRetaliation();
        }
        advanceToMain(game, p.id);
        if (mode === "nondefending-ranger") {
          p.declareAttack(target, q.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
        const defender = mode === "nondefending-ranger" ? q.card(giantTortoise) : target;
        p.declareAttack(p.card(giantTortoise), defender);
        const stat = (property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: mode === "nondefending-ranger" ? p.id : q.id,
            bindings: {},
          });
        const power = stat("power"),
          life = stat("life");
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(source, { targets: { "target-1": [host.objectId] }, reservePayment }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { targets: { "target-1": [target.objectId] }, reservePayment });
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
        passEffectsStack(game);
        const bonus = mode === "defending-ranger";
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(!bonus);
        expect(stat("power")).toBe(bonus ? 3 : power);
        expect(stat("life")).toBe(bonus ? 6 : life);
        finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
          q.card(trivariateDream).objectId,
          p.card(trainingSword).objectId,
        ]);
        for (let step = 0; game.state.combat && step < 64; step++) {
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", bonus ? [target.objectId] : []);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(bonus ? 3 : 0);
        if (load) {
          const damage = game.state.objects[q.card(champion).objectId]!.damage;
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(damage + 2);
        }
        advanceToMain(game, q.id);
        expect(stat("power")).toBe(power);
        expect(stat("life")).toBe(life);
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(
          mode !== "nondefending-ranger",
        );
        if (bonus) {
          const damage = game.state.objects[p.card(champion).objectId]!.damage;
          q.declareAttack(target, p.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(damage + 3);
        }
        advanceToMain(game, p.id);
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
      });
});
