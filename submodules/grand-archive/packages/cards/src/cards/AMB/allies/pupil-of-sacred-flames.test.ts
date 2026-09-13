import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  currentDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { landscapeCorsair } from "./landscape-corsair.ts";
import { wanderingGlaivier } from "./wandering-glaivier.ts";
import { pupilOfSacredFlames } from "./pupil-of-sacred-flames.ts";

/** @covers n06isycm60-a1 */
describe("Pupil of Sacred Flames — Class Bonus On Attack empower", () => {
  for (const classBonus of [false, true]) {
    for (const accept of [false, true]) {
      it(`classBonus=${classBonus}, banish fire=${accept}`, () => {
        const champion = createClassBonusTestChampion(
          pupilOfSacredFlames,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [pupilOfSacredFlames],
              graveyard: [wanderingGlaivier, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.declareAttack(
          player.card(pupilOfSacredFlames, { zone: "field" }),
          opponent.card(champion, { zone: "field" }),
        );
        const fire = player.card(wanderingGlaivier, { zone: "graveyard" });
        const filler = player.card(woodlandSquirrels, { zone: "graveyard" });
        passEffectsStack(game);
        if (classBonus) {
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [filler.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "resolve-effect-choice", [fire.objectId]);
            }
            passEffectsStack(game);
            expect(game.state.objects[fire.objectId]!.zone).toBe("banishment");
          } else passEffectsStack(game);
        }
        expect(game.state.players[player.id]!.states.empower ?? 0).toBe(
          classBonus && accept ? 2 : 0,
        );
        game.resolveCombatWithoutRetaliation();
      });
    }
  }
});

/** @covers n06isycm60-a2 */
describe("Pupil of Sacred Flames — Kongming Bonus On Death", () => {
  for (const east of [false, true]) {
    it(`${east ? "draws for each player" : "does not draw"} while facing ${east ? "East" : "North"}`, () => {
      const base = lineageTestChampion("Kongming", 0);
      const starter = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...requireSingleFace(base),
            elements: ["NORM", "FIRE", "WATER", "WIND", "TERA"] as const,
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        firstPlayer: "playerOne",
        playerOne: {
          champion: starter,
          zones: {
            hand: [
              landscapeCorsair,
              pupilOfSacredFlames,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            memory: [woodlandSquirrels],
            "material-deck": [
              (() => {
                if (kongmingWaywardMaven.layout.kind !== "single-faced")
                  throw new Error("Expected single-faced card");
                return {
                  ...kongmingWaywardMaven,
                  layout: {
                    kind: "single-faced" as const,
                    face: {
                      ...kongmingWaywardMaven.layout.face,
                      elements: ["NORM", "FIRE", "WATER", "WIND", "TERA"] as const,
                    },
                  },
                };
              })(),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: {
            field: [automatedGardener],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        definitions: [shiftingCurrents],
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.materialize(kongmingWaywardMaven);
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      if (east) {
        player.activate(landscapeCorsair, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        answerDecision(game, "resolve-direction-choice", "east");
        passEffectsStack(game);
      }
      player.activate(pupilOfSacredFlames, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
      }
      const pupil = player.card(pupilOfSacredFlames, { zone: "field" });
      for (
        let step = 0;
        step < 80 &&
        !(game.state.turn.playerId === opponent.id && game.state.turn.phase === "main");
        step++
      ) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else if (
          wait.kind === "decision" &&
          game.state.decision?.kind === "resolve-optional-effect"
        )
          answerDecision(game, "resolve-optional-effect", false);
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      const ownDeck = player.zone("main-deck");
      const enemyDeck = opponent.zone("main-deck");
      const ownHand = player.zone("hand");
      const enemyHand = opponent.zone("hand");
      opponent.declareAttack(opponent.card(automatedGardener, { zone: "field" }), pupil);
      advanceCombatToTrigger(game, "n06isycm60-a2");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "n06isycm60-a2",
        ),
      ).toBe(true);
      passEffectsStack(game);
      expect(player.zone("hand")).toEqual(east ? [...ownHand, ownDeck[0]!] : ownHand);
      expect(opponent.zone("hand")).toEqual(east ? [...enemyHand, enemyDeck[0]!] : enemyHand);
      if (currentDecision(game)?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", east);
        if (east && currentDecision(game)?.kind === "resolve-direction-choice") {
          answerDecision(game, "resolve-direction-choice", "south");
          passEffectsStack(game);
          expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("south");
        }
      }
    });
  }
});
