// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import * as onePiece from "@tcg/op-engine/practice-st01";
import { decideOnePieceBot } from "./bot-decision";

test("One Piece serialized setup and active choices match the original policy", () => {
  let state = onePiece.createMatch(
    onePiece.createSt01MirrorPracticeConfig({ firstPlayer: "north" }),
  );
  onePiece.placeStartingLife(state, "south");
  onePiece.placeStartingLife(state, "north");
  let accepted = 0;
  for (let step = 0; step < 20; step++) {
    const seat =
      state.status === "active"
        ? state.activeSeat
        : onePiece.passOnlyStrategy(state, "north", onePiece.getLegalCommands(state, "north"))
          ? "north"
          : "south";
    const legal = onePiece.getLegalCommands(state, seat);
    const setup = state.status === "setup";
    const expected = setup
      ? onePiece.passOnlyStrategy(state, seat, legal)
      : onePiece.greedyStrategy(state, seat, legal);
    if (seat === "north")
      expect(decideOnePieceBot(structuredClone({ state, setup })).command).toEqual(expected);
    if (!expected) break;
    const outcome = onePiece.applyCommand(state, expected);
    const clonedOutcome = onePiece.applyCommand(structuredClone(state), structuredClone(expected));
    expect(clonedOutcome).toEqual(outcome);
    if (!outcome.accepted) break;
    state = outcome.state;
    accepted++;
  }
  expect(accepted).toBeGreaterThan(0);
});
