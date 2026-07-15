import { describe, test } from "vite-plus/test";
import { op07HePossessesTheWorldSMostBrilliantMind114 } from "../../../../../cards/src/cards/OP07/events/114-he-possesses-the-world-s-most-brilliant-mind.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-114 He Possesses the World's Most Brilliant Mind", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07HePossessesTheWorldSMostBrilliantMind114);
  });
});
