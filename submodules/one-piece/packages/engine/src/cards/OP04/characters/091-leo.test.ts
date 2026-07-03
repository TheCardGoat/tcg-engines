import { describe, test } from "vite-plus/test";
import { op04Leo091 } from "../../../../../cards/src/cards/OP04/characters/091-leo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-091 Leo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Leo091);
  });
});
