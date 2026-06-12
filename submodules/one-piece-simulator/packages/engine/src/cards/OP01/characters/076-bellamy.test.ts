import { describe, test } from "vite-plus/test";
import { op01Bellamy076 } from "../../../../../cards/src/cards/OP01/characters/076-bellamy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-076 Bellamy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Bellamy076);
  });
});
