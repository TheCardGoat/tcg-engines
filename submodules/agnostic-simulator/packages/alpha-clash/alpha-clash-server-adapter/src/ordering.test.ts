import { expect, test } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { AcTestEngine } from "@tcg/alpha-clash-engine/testing";
import { alphaClashBotCommandCandidates } from "./bot";

test("practice bot submits a complete native order and waits for the other owner", () => {
  const card = getCard("ac-vtd2-012-p-white");
  const filler = getCard("ac-ac1-027");
  const game = AcTestEngine.fromFixture({
    turnNumber: 5,
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: Array.from({ length: 8 }, () => filler),
      clash: [
        { card, ready: false },
        { card, ready: false },
      ],
    },
    playerTwo: { contender: getCard("ac-ac1-096"), deck: Array.from({ length: 8 }, () => filler) },
  });
  game.playerOne.endTurn();
  const choice = game.state.pendingChoices[0];
  const expectedIds =
    choice.kind === "modal" && choice.triggerOrder
      ? choice.triggerOrder.batch
          .filter((trigger) => trigger.controller === choice.playerId)
          .map((trigger) => trigger.id)
      : choice.kind === "ordering"
        ? choice.candidates.map((candidate) => candidate.id)
        : [];
  if (!expectedIds.length) throw new Error("Expected native ordering");
  expect(alphaClashBotCommandCandidates(game.state, "player-two")).toEqual([]);
  const command = alphaClashBotCommandCandidates(game.state, "player-one")[0];
  expect(command).toMatchObject({
    type: "resolveChoice",
    orderedIds: expectedIds,
  });
  expect(applyCommand(game.state, command).success).toBe(true);
  expect(game.state.pendingChoices).toHaveLength(0);
});
