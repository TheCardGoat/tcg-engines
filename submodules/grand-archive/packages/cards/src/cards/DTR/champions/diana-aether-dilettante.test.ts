import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { dianaAetherDilettante } from "./diana-aether-dilettante.ts";
import { backdash } from "../actions/backdash.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { radiantVega } from "../weapons/radiant-vega.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers m7f6r8f3y8-a1 */
describe("Diana — distant entry and paid Aetherwing materialization", () => {
  for (const distant of [false, true])
    for (const weapon of [trivariateDream, radiantVega])
      it(`distant=${distant}, weapon=${weapon.slug}`, () => {
        const starter = enableAllTestElements(lineageTestChampion("Diana", 0));
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            zones: {
              "material-deck": [dianaAetherDilettante, trivariateDream, radiantVega],
              field: [enableAllTestElements(trainingSword)],
              memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              hand: [backdash, woodlandSquirrels],
              banishment: [weapon],
            },
          },
          playerTwo: {
            champion: lineageTestChampion("Opponent", 0),
            zones: { "material-deck": [weapon] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(starter),
          chosen = p.card(weapon, { zone: "material-deck" });
        p.materialize(dianaAetherDilettante);
        expect(p.zone("memory")).toHaveLength(2);
        if (distant)
          p.activate(backdash, {
            targets: { "target-1": [hero.objectId] },
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).not.toBe(
          dianaAetherDilettante.canonicalId,
        );
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
          dianaAetherDilettante.canonicalId,
        );
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(distant);
        expect(game.state.objects[chosen.objectId]!.zone).toBe("material-deck");
        if (distant) {
          const pending = game.state;
          for (const ids of [
            [],
            [p.card(trainingSword).objectId],
            [q.card(weapon, { zone: "material-deck" }).objectId],
            [p.card(weapon, { zone: "banishment" }).objectId],
            [chosen.objectId, chosen.objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(pending);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          expect(game.state.decision).toMatchObject({
            kind: "announce-effect-materialization",
            payCosts: true,
            playerId: p.id,
          });
          expect(p.zone("memory")).toHaveLength(3);
          answerDecision(game, "announce-effect-materialization", {});
          expect(p.zone("memory")).toHaveLength(weapon === radiantVega ? 2 : 3);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("effects-stack");
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("field");
        }
        expect(game.state.decision).toBeFalsy();
        expect(game.state.stack).toHaveLength(0);
        expect(q.card(weapon, { zone: "material-deck" })).toBeDefined();
      });
});

/** @covers m7f6r8f3y8-a2 */
describe("Diana — inherited Ranged 1 combat", () => {
  for (const position of ["material-deck", "current", "successor"] as const)
    for (const distant of [false, true])
      it(`position=${position}, distant=${distant}`, () => {
        const starter = lineageTestChampion("Diana", 0),
          opponent = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage:
              position === "material-deck"
                ? []
                : [
                    dianaAetherDilettante,
                    ...(position === "successor" ? [lineageTestChampion("Diana", 2)] : []),
                  ],
            zones: {
              "material-deck": position === "material-deck" ? [dianaAetherDilettante] : [],
              field: [trainingSword, woodlandSquirrels],
              hand: [backdash, woodlandSquirrels],
            },
          },
          playerTwo: { champion: opponent },
        });
        const p = game.player("player-one"),
          hero = p.card(starter),
          target = game.player("player-two").card(opponent);
        if (distant) {
          p.activate(backdash, {
            targets: { "target-1": [hero.objectId] },
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
        }
        p.declareAttack(hero, target, { weaponIds: [p.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          distant && position !== "material-deck" ? 2 : 1,
        );
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          distant && position !== "material-deck" ? 3 : 2,
        );
      });
});
