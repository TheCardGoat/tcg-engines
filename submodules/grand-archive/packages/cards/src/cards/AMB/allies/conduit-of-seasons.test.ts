import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { focalIntensity } from "../../RDO/actions/focal-intensity.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { landscapeCorsair } from "./landscape-corsair.ts";
import { conduitOfSeasons } from "./conduit-of-seasons.ts";

const ALL_ELEMENTS = ["NORM", "FIRE", "WATER", "WIND", "TERA", "EXIA"] as const;

function withElements(card: typeof kongmingWaywardMaven) {
  if (card.layout.kind !== "single-faced") throw new Error("Expected single-faced card");
  return {
    ...card,
    layout: {
      kind: "single-faced" as const,
      face: { ...card.layout.face, elements: ALL_ELEMENTS },
    },
  };
}

function kongmingStarter() {
  return withElements(lineageTestChampion("Kongming", 0));
}

function kongmingLevelOne() {
  return withElements(kongmingWaywardMaven);
}

function faceDirection(game: GrandArchiveTestEngine, direction: "east" | "west" | "north"): void {
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  player.materialize(kongmingLevelOne());
  player.pass();
  opponent.pass();
  passEffectsStack(game);
  for (let step = 0; game.state.turn.phase !== "main" && step < 64; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision" && game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", false);
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  if (direction === "north") return;
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
  answerDecision(game, "resolve-direction-choice", direction);
  passEffectsStack(game);
  expect(game.state.players[player.id]!.states["shifting-currents"]).toBe(direction);
}

function fixture() {
  const starter = kongmingStarter();
  return GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      zones: {
        hand: [
          landscapeCorsair,
          conduitOfSeasons,
          focalIntensity,
          ...Array.from({ length: 6 }, () => woodlandSquirrels),
        ],
        memory: [woodlandSquirrels],
        "material-deck": [kongmingLevelOne()],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: lineageTestChampion("Opponent", 0),
      zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
    },
    definitions: [shiftingCurrents],
  });
}

/** @covers nm77bnz4cc-a1 */
describe("Conduit of Seasons — West damage prevention", () => {
  for (const west of [false, true]) {
    it(`${west ? "prevents 2" : "prevents none"} while Shifting Currents face ${west ? "West" : "North"}`, () => {
      const game = fixture();
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      faceDirection(game, west ? "west" : "north");
      player.activate(conduitOfSeasons, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      const conduit = player.card(conduitOfSeasons, { zone: "field" });
      player.activate(focalIntensity, {
        reservePayment: [
          { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
        targets: { "target-1": [conduit.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[conduit.objectId]!.damage).toBe(west ? 0 : 1);
    });
  }
});

/** @covers nm77bnz4cc-a2 */
describe("Conduit of Seasons — East On Attack recover and memory draw", () => {
  for (const east of [false, true]) {
    it(`${east ? "recovers and draws into memory" : "does neither"} while facing ${east ? "East" : "North"}`, () => {
      const game = fixture();
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      faceDirection(game, east ? "east" : "north");
      player.activate(conduitOfSeasons, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      const conduit = player.card(conduitOfSeasons, { zone: "field" });
      const deck = player.zone("main-deck");
      const memory = player.zone("memory");
      player.declareAttack(
        conduit,
        opponent.card(lineageTestChampion("Opponent", 0), { zone: "field" }),
      );
      passEffectsStack(game);
      expect(player.zone("memory")).toEqual(east ? [...memory, deck[0]!] : memory);
      expect(player.zone("main-deck")).toEqual(east ? deck.slice(1) : deck);
      game.resolveCombatWithoutRetaliation();
    });
  }
});
