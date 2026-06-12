import { describe, test } from "vite-plus/test";
import { op11Morgan094 } from "../../../../../cards/src/cards/OP11/characters/094-morgan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-094 Morgan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Morgan094);
  });
});
