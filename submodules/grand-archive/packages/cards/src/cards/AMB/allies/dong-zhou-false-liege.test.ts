import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, currentDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { dongZhouFalseLiege } from "./dong-zhou-false-liege.ts";

function advanceToEnd(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to end`);
  }
  throw new Error("Did not reach the end phase");
}

/** @covers lrbcgpny3d-a2 */
describe("Dong Zhou, False Liege — Class Bonus On Enter modes", () => {
  for (const classBonus of [false, true]) {
    for (const rest of [false, true]) {
      it(`classBonus=${classBonus}, rest=${rest}`, () => {
        const champion = createClassBonusTestChampion(
          dongZhouFalseLiege,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [dongZhouFalseLiege, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              field: [galesMare],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(dongZhouFalseLiege, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "lrbcgpny3d-a2",
          ) || game.state.decision?.kind === "announce-triggered-ability",
        ).toBe(classBonus);
        if (game.state.decision?.kind === "announce-triggered-ability") {
          const before = game.state;
          if (rest) {
            answerDecision(game, "announce-triggered-ability", {
              modeIds: ["mode-2", "mode-3"],
            });
          } else {
            try {
              answerDecision(game, "announce-triggered-ability", {});
            } catch {
              expect(game.state).toEqual(before);
              answerDecision(game, "announce-triggered-ability", { modeIds: ["mode-1", "mode-3"] });
            }
          }
        }
        passEffectsStack(game);
        if (classBonus && currentDecision(game)?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", rest);
          for (let step = 0; rest && currentDecision(game) && step < 8; step++) {
            if (currentDecision(game)?.kind === "resolve-effect-choice") {
              answerDecision(game, "resolve-effect-choice", ["mode-2", "mode-3"]);
            } else break;
            passEffectsStack(game);
          }
          passEffectsStack(game);
        }
        const dong = player.card(dongZhouFalseLiege, { zone: "field" });
        const ownHorse = player.card(galesMare, { zone: "field" });
        if (classBonus && rest) {
          expect(game.state.objects[dong.objectId]!.states.has("rested")).toBe(true);
          if (game.state.decision) {
            player.executeLegal(
              (candidate) =>
                candidate.command.move === "answer-decision" &&
                Array.isArray(candidate.command.answer) &&
                candidate.command.answer.includes("mode-2") &&
                candidate.command.answer.includes("mode-3"),
              "choose empower and vigor",
            );
            passEffectsStack(game);
          }
          expect(player.cards(galesMare, { zone: "field" })).toHaveLength(1);
        } else {
          expect(game.state.objects[dong.objectId]!.states.has("rested")).toBe(false);
          expect(player.cards(galesMare, { zone: "field" })).toHaveLength(1);
          expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
        }
      });
    }
  }
});
