import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { airshipCannoneer } from "./airship-cannoneer.ts";

/** @covers d53zc9p4lp-a1 */
describe("Airship Cannoneer — Class Bonus Ranged 4", () => {
  proveRangedAlly({
    card: airshipCannoneer,
    power: 2,
    ranged: 4,
    classBonus: true,
    declineOptionalAttackEffect: true,
  });
});

/** @covers d53zc9p4lp-a2 */
describe("Airship Cannoneer — banish exactly three Fire cards on attack", () => {
  for (const classBonus of [false, true])
    for (const available of [0, 2, 3, 4]) {
      for (const accept of [false, true]) {
        it(`Class Bonus=${classBonus}, Fire cards=${available}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            airshipCannoneer,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [airshipCannoneer, woodlandSquirrels],
                hand: [airshipEngineer],
                memory: [airshipEngineer],
                graveyard: [
                  woodlandSquirrels,
                  ...Array.from({ length: available }, () => airshipEngineer),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                graveyard: [airshipEngineer],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const source = player.card(airshipCannoneer);
          const target = opponent.card(champion);
          const grave = player.zone("graveyard");
          const candidates = player.cards(airshipEngineer, { zone: "graveyard" });
          const hand = player.zone("hand");
          const memory = player.zone("memory");
          player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(player.zone("graveyard")).toEqual(grave);
          expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.declareAttack(source, target);
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "d53zc9p4lp-a2",
            ),
          ).toBe(true);
          expect(player.zone("graveyard")).toEqual(grave);
          expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", accept);
          const succeeds = available >= 3 && accept;
          const chosen = succeeds ? candidates.slice(-3) : [];
          if (game.state.decision?.kind === "resolve-effect-choice") {
            expect(succeeds).toBe(true);
            const ids = chosen.map((ref) => ref.objectId);
            for (const invalid of [
              [],
              ids.slice(0, 2),
              [ids[0]!, ids[0]!, ids[1]!],
              [...ids, source.objectId],
              [ids[0]!, ids[1]!, player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
              [ids[0]!, ids[1]!, player.card(airshipEngineer, { zone: "hand" }).objectId],
              [ids[0]!, ids[1]!, player.card(airshipEngineer, { zone: "memory" }).objectId],
              [ids[0]!, ids[1]!, opponent.card(airshipEngineer).objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            if (available === 4) {
              const before = game.state;
              expect(() =>
                answerDecision(
                  game,
                  "resolve-effect-choice",
                  candidates.map((ref) => ref.objectId),
                ),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", ids);
          }
          passEffectsStack(game);
          expect(player.zone("banishment")).toEqual(chosen);
          expect(player.zone("graveyard")).toEqual(
            grave.filter((ref) => !chosen.some((selected) => selected.objectId === ref.objectId)),
          );
          expect(player.zone("hand")).toEqual(hand);
          expect(player.zone("memory")).toEqual(memory);
          expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(succeeds);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(
            3 + (classBonus && succeeds ? 4 : 0),
          );
          expect(opponent.zone("graveyard")).toHaveLength(1);
          advanceToRecollection(game, opponent.id);
          expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
        });
      }
    }
});
