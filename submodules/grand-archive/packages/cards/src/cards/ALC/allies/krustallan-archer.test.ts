import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { deployGunshield } from "../actions/deploy-gunshield.ts";
import { firetunedAutomaton } from "./firetuned-automaton.ts";
import { krustallanArcher } from "./krustallan-archer.ts";

/** @covers 3p6i0iqmyn-a1 */
describe("Krustallan Archer — Class Bonus Ranged 3", () => {
  proveRangedAlly({
    card: krustallanArcher,
    power: 1,
    ranged: 3,
    classBonus: true,
    declineOptionalAttackEffect: true,
  });
});

/** @covers 3p6i0iqmyn-a2 */
describe("Krustallan Archer — attack-triggered Floating Memory banishment", () => {
  for (const classBonus of [false, true]) {
    for (const available of [false, true]) {
      for (const accept of [false, true]) {
        it(`Class Bonus=${classBonus}, eligible=${available}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            krustallanArcher,
            classBonus,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [krustallanArcher, woodlandSquirrels],
                hand: [deployGunshield],
                graveyard: [
                  woodlandSquirrels,
                  firetunedAutomaton,
                  ...(available ? [deployGunshield, deployGunshield] : []),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [deployGunshield], "main-deck": [woodlandSquirrels] },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const archer = player.card(krustallanArcher);
          const target = opponent.card(champion);
          const hand = player.zone("hand");
          const deck = player.zone("main-deck");
          const graveyard = player.zone("graveyard");
          player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(player.zone("hand")).toEqual(hand);
          expect(player.zone("graveyard")).toEqual(graveyard);
          expect(game.state.objects[archer.objectId]!.states.has("distant")).toBe(false);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.declareAttack(archer, target);
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "3p6i0iqmyn-a2",
            ),
          ).toBe(true);
          expect(player.zone("hand")).toEqual(hand);
          expect(game.state.objects[archer.objectId]!.states.has("distant")).toBe(false);
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", accept);
          const succeeds = available && accept;
          const chosen = succeeds
            ? player.cards(deployGunshield, { zone: "graveyard" })[1]!
            : undefined;
          if (chosen) {
            const candidates = player.cards(deployGunshield, { zone: "graveyard" });
            for (const invalid of [
              [],
              candidates.map((ref) => ref.objectId),
              [player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
              [player.card(firetunedAutomaton).objectId],
              [opponent.card(deployGunshield).objectId],
              [player.card(deployGunshield, { zone: "hand" }).objectId],
              [archer.objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          }
          passEffectsStack(game);
          expect(player.zone("banishment")).toEqual(chosen ? [chosen] : []);
          expect(player.zone("graveyard")).toEqual(
            graveyard.filter((ref) => ref.objectId !== chosen?.objectId),
          );
          expect(player.zone("hand")).toEqual(chosen ? [...hand, deck[0]] : hand);
          expect(player.zone("main-deck")).toEqual(chosen ? deck.slice(1) : deck);
          expect(game.state.objects[archer.objectId]!.states.has("distant")).toBe(succeeds);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(
            2 + (classBonus && succeeds ? 3 : 0),
          );
          expect(opponent.zone("graveyard")).toHaveLength(1);
          advanceToRecollection(game, opponent.id);
          expect(game.state.objects[archer.objectId]!.states.has("distant")).toBe(false);
        });
      }
    }
  }
});
