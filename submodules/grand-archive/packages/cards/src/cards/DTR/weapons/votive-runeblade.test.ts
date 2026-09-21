import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { votiveRuneblade } from "./votive-runeblade.ts";
import { swordOfShadows } from "./sword-of-shadows.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers cnjo0ehqyk-a1 */
describe("Votive Runeblade — sacrifice another controlled Sword regalia to wake the attacker", () => {
  for (const matching of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        it(`class=${matching}, eligible swords=${available}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            votiveRuneblade,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  votiveRuneblade,
                  enfeebledDagger,
                  ...(available ? [trainingSword, swordOfShadows] : []),
                ],
                graveyard: [trainingSword],
              },
            },
            playerTwo: { champion, zones: { field: [trainingSword] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const hero = p.card(champion),
            target = q.card(champion),
            blade = p.card(votiveRuneblade);
          p.declareAttack(hero, target, { weaponIds: [blade.objectId] });
          expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
          advanceCombatToTrigger(game, "cnjo0ehqyk-a1");
          passEffectsStack(game);
          if (matching && game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept && available) {
              const before = game.state;
              for (const invalid of [
                blade,
                p.card(enfeebledDagger),
                q.card(trainingSword),
                p.card(trainingSword, { zone: "graveyard" }),
              ]) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
              answerDecision(game, "resolve-effect-choice", [
                p.card(trainingSword, { zone: "field" }).objectId,
              ]);
              passEffectsStack(game);
            }
          }
          const wakes = matching && available && accept;
          expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(!wakes);
          expect(p.cards(trainingSword, { zone: "banishment" })).toHaveLength(wakes ? 1 : 0);
          expect(p.cards(trainingSword, { zone: "graveyard" })).toHaveLength(1);
          expect(q.cards(trainingSword, { zone: "field" })).toHaveLength(1);
          expect(p.cards(enfeebledDagger, { zone: "field" })).toHaveLength(1);
          expect(p.cards(swordOfShadows, { zone: "field" })).toHaveLength(available ? 1 : 0);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          expect(game.state.objects[blade.objectId]!.counters.durability).toBe(1);
          if (!wakes) {
            const before = game.state;
            expect(() => p.declareAttack(hero, target, { weaponIds: [blade.objectId] })).toThrow();
            expect(game.state).toEqual(before);
          } else {
            p.declareAttack(hero, target, { weaponIds: [blade.objectId] });
            advanceCombatToTrigger(game, "cnjo0ehqyk-a1");
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", false);
            passEffectsStack(game);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[target.objectId]!.damage).toBe(2);
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
            expect(game.state.objects[blade.objectId]!.zone).toBe("banishment");
          }
        });
});
