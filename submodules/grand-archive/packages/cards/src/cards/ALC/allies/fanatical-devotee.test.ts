import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { fanaticalDevotee } from "./fanatical-devotee.ts";

/** @covers 1gxrpx8jyp-a1 */
describe("Fanatical Devotee — Memory 4+ power", () => {
  for (const memory of [3, 4, 5]) {
    it(`has the printed attack power with ${memory} memory`, () => {
      const champion = createClassBonusTestChampion(fanaticalDevotee, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [fanaticalDevotee, fanaticalDevotee],
            memory: Array.from({ length: memory }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            memory: Array.from({ length: 5 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(champion);
      player.declareAttack(player.cards(fanaticalDevotee)[0]!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(memory >= 4 ? 3 : 2);
      advanceToRecollection(game, opponent.id);
      advanceToRecollection(game, player.id);
      for (let step = 0; game.state.turn.phase !== "main" && step < 24; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(player.zone("memory")).toHaveLength(0);
      player.declareAttack(player.cards(fanaticalDevotee)[1]!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe((memory >= 4 ? 3 : 2) + 2);
    });
  }
});

/** @covers 1gxrpx8jyp-a2 */
describe("Fanatical Devotee — death banishment and reflexive damage", () => {
  for (const classBonus of [false, true])
    for (const available of [0, 1, 2, 3]) {
      for (const accept of [false, true]) {
        it(`Class Bonus=${classBonus}, other Fire=${available}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            fanaticalDevotee,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [fanaticalDevotee],
                graveyard: [
                  woodlandSquirrels,
                  ...Array.from({ length: available }, () => airshipEngineer),
                ],
                hand: [airshipEngineer],
                memory: [airshipEngineer],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [automatedGardener, woodlandSquirrels],
                graveyard: [airshipEngineer],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const source = player.card(fanaticalDevotee);
          const defender = opponent.card(automatedGardener);
          const ownChampion = player.card(champion);
          const target = opponent.card(champion);
          const grave = player.zone("graveyard");
          const candidates = player.cards(airshipEngineer, { zone: "graveyard" });
          player.declareAttack(source, defender);
          for (let step = 0; game.state.combat && step < 64; step++) {
            if (
              game.state.stack.some(
                (item) => item.kind === "triggered-ability" && item.ability.id === "1gxrpx8jyp-a2",
              )
            )
              break;
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", [defender.objectId]);
            else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(player.zone("graveyard")).toEqual([...grave, source]);
          expect(game.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(
            classBonus ? 1 : 0,
          );
          if (classBonus) {
            expect(
              game.state.stack.find(
                (item) => item.kind === "triggered-ability" && item.ability.id === "1gxrpx8jyp-a2",
              )?.sourceId,
            ).toBe(source.objectId);
          }
          passEffectsStack(game);
          if (classBonus && available < 2) {
            expect(game.state.decision?.kind).not.toBe("resolve-optional-effect");
          }
          if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", accept);
          const succeeds = classBonus && available >= 2 && accept;
          const chosen = succeeds ? candidates.slice(-2) : [];
          if (game.state.decision?.kind === "resolve-effect-choice") {
            expect(succeeds).toBe(true);
            const ids = chosen.map((card) => card.objectId);
            for (const invalid of [
              [],
              [ids[0]!],
              [ids[0]!, ids[0]!],
              [...ids, source.objectId],
              [ids[0]!, source.objectId],
              [ids[0]!, player.card(airshipEngineer, { zone: "hand" }).objectId],
              [ids[0]!, player.card(airshipEngineer, { zone: "memory" }).objectId],
              [ids[0]!, opponent.card(airshipEngineer).objectId],
              [ids[0]!, player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", ids);
          }
          if (game.state.decision?.kind === "announce-triggered-ability") {
            expect(succeeds).toBe(true);
            for (const invalid of [
              [],
              [defender.objectId],
              [ownChampion.objectId, target.objectId],
            ]) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "announce-triggered-ability", {
                  targets: { "target-1": invalid },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            expect(game.state.stack.at(-1)?.kind).toBe("triggered-ability");
          }
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(player.zone("banishment")).toEqual(chosen);
          expect(player.zone("graveyard")).toEqual(
            [...grave, source].filter(
              (ref) => !chosen.some((card) => card.objectId === ref.objectId),
            ),
          );
          expect(game.state.objects[target.objectId]!.damage).toBe(succeeds ? 3 : 0);
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
          expect(opponent.zone("graveyard")).toEqual([
            opponent.card(airshipEngineer, { zone: "graveyard" }),
          ]);
        });
      }
    }
});
