import { describe, test } from "vite-plus/test";
import { op04PlagueRounds055 } from "../../../../../cards/src/cards/OP04/events/055-plague-rounds.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-055 Plague Rounds", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04PlagueRounds055);
  });
});
