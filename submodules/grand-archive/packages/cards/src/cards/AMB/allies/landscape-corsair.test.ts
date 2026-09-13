import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { landscapeCorsair } from "./landscape-corsair.ts";

const ALL_ELEMENTS = ["NORM", "FIRE", "WATER", "WIND", "TERA", "EXIA"] as const;

function withElements(card: Parameters<typeof requireSingleFace>[0]) {
  const face = requireSingleFace(card);
  return {
    ...card,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, elements: [...ALL_ELEMENTS] },
    },
  };
}

function kongmingStarter() {
  return withElements(lineageTestChampion("Kongming", 0));
}

function kongmingLevelOne() {
  return withElements(kongmingWaywardMaven);
}

/** @covers racxis1ji8-a1 */
describe("Landscape Corsair — Kongming Bonus direction change", () => {
  for (const kongming of [false, true]) {
    for (const accept of [false, true]) {
      it(`kongming=${kongming}, change direction=${accept}`, () => {
        const champion = kongming
          ? kongmingStarter()
          : createClassBonusTestChampion(landscapeCorsair, true, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          phase: kongming ? "materialize" : "main",
          playerOne: {
            champion,
            zones: {
              hand: [landscapeCorsair, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              memory: kongming ? [woodlandSquirrels] : [],
              "material-deck": kongming ? [kongmingLevelOne()] : [],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: lineageTestChampion("Opponent", 0),
            zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
          },
          definitions: [shiftingCurrents],
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        if (kongming) {
          player.materialize(kongmingLevelOne());
          player.pass();
          opponent.pass();
          passEffectsStack(game);
          expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
          for (let step = 0; game.state.turn.phase !== "main" && step < 64; step++) {
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
        }
        player.activate(landscapeCorsair, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "racxis1ji8-a1",
          ),
        ).toBe(kongming);
        passEffectsStack(game);
        if (kongming) {
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            expect(game.state.decision?.kind).toBe("resolve-direction-choice");
            const before = game.state;
            expect(() => answerDecision(game, "resolve-direction-choice", "north")).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-direction-choice", "east");
          }
          passEffectsStack(game);
          expect(game.state.players[player.id]!.states["shifting-currents"]).toBe(
            accept ? "east" : "north",
          );
        } else {
          expect(game.state.players[player.id]!.states["shifting-currents"] ?? false).toBe(false);
        }
      });
    }
  }
});
