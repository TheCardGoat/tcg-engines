import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { aellaZephyrsHand } from "./aella-zephyrs-hand.ts";
import { spiritOfWind } from "../../DOA/champions/spirit-of-wind.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

// Focused first-activation regression; this is not complete coverage of both abilities.
it("Aella's first activation is free, but the same source pays three on a later turn", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: spiritOfWind,
      zones: {
        field: [aellaZephyrsHand],
        hand: Array.from({ length: 3 }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: spiritOfWind,
      zones: {
        field: [giantTortoise],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one");
  const target = game.player("player-two").card(giantTortoise);
  const source = p.card(aellaZephyrsHand);
  const initialIncarnation = game.state.objects[source.objectId]!.incarnation;
  const command = {
    move: "activate-ability" as const,
    sourceId: source.objectId,
    abilityId: "G8pN8Hackq-a2",
    targets: { "target-1": [target.objectId] },
  };
  p.execute(command);
  expect(p.zone("memory")).toHaveLength(0);
  passEffectsStack(game);
  expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
  advanceToMain(game, p.id, game.state.turn.number);
  expect(game.state.objects[target.objectId]!.zone).toBe("field");
  expect(game.state.objects[source.objectId]!.incarnation).toBe(initialIncarnation);
  const before = game.state;
  expect(p.tryExecute(command).ok).toBe(false);
  expect(game.state).toBe(before);
  p.execute({
    ...command,
    reservePayment: p
      .zone("hand")
      .slice(0, 3)
      .map((card) => ({ kind: "card", cardId: card.objectId })),
  });
  expect(p.zone("memory")).toHaveLength(3);
  passEffectsStack(game);
  expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
});
