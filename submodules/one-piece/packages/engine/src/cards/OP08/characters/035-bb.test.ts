import { describe, test } from "vite-plus/test";
import { op08Bb035 } from "../../../../../cards/src/cards/OP08/characters/035-bb.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-035 BB", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Bb035);
  });
});
