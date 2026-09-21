import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { enfeebledDagger } from "./enfeebled-dagger.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainedHawk } from "../../DOA/allies/trained-hawk.ts";
import { blazingDirewolf } from "../../DOA/allies/blazing-direwolf.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  advanceCombatToTrigger,
  answerDecision,
} from "../../../testing/decisions.ts";

/** @covers idpdon8f0h-a1 */
describe("Enfeebled Dagger — targeted damage and class-restricted source reduction", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const championTarget of [false, true])
        it(`class=${matching}, own=${own}, champion=${championTarget}`, () => {
          const champion = createClassBonusTestChampion(
            enfeebledDagger,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [enfeebledDagger, giantTortoise, trainedHawk, trainingSword],
                graveyard: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise, trainedHawk, trainingSword],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q,
            foe = own ? q : p;
          const source = p.card(enfeebledDagger),
            target = owner.card(championTarget ? champion : giantTortoise, { zone: "field" }),
            victim = foe.card(champion);
          if (!own) q.pass();
          for (const invalid of [
            source,
            p.card(trainingSword),
            p.card(giantTortoise, { zone: "graveyard" }),
          ]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "idpdon8f0h-a1", {
                targets: { "target-unit": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activateAbility(source, "idpdon8f0h-a1", {
            targets: { "target-unit": [target.objectId] },
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          const options = championTarget ? { weaponIds: [owner.card(trainingSword).objectId] } : {};
          owner.declareAttack(target, victim, options);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[victim.objectId]!.damage).toBe(matching ? 0 : 1);
          owner.declareAttack(owner.card(trainedHawk), victim);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[victim.objectId]!.damage).toBe(matching ? 2 : 3);
          advanceToMain(game, foe.id);
          advanceToMain(game, owner.id);
          owner.declareAttack(target, victim, options);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[victim.objectId]!.damage).toBe(matching ? 3 : 4);
        });

  for (const matching of [false, true])
    it(`reduces both noncombat and combat damage from the same ally, class=${matching}`, () => {
      const champion = createClassBonusTestChampion(
        enfeebledDagger,
        matching,
        "activation-discount",
      );
      const enemyChampion = grantTestChampionLevel(
        createClassBonusTestChampion(blazingDirewolf, true, "activation-discount"),
        5,
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { field: [enfeebledDagger], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion: enemyChampion,
          zones: {
            field: [blazingDirewolf, giantTortoise],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        wolf = q.card(blazingDirewolf),
        hero = p.card(champion);
      q.pass();
      p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [wolf.objectId] },
      });
      passEffectsStack(game);
      q.declareAttack(q.card(giantTortoise), hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      for (const expired of [false, true]) {
        if (expired) {
          advanceToMain(game, p.id);
          advanceToMain(game, q.id);
        }
        q.declareAttack(wolf, hero);
        advanceCombatToTrigger(game, "gKVMTAeLXQ-a2");
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          expired ? (matching ? 4 : 9) : matching ? 1 : 3,
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          expired ? (matching ? 8 : 13) : matching ? 2 : 7,
        );
      }
    });
});
