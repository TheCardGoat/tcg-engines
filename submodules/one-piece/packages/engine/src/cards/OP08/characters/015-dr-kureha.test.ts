import { describe, test } from "vite-plus/test";
import { op08DrKureha015 } from "../../../../../cards/src/cards/OP08/characters/015-dr-kureha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-015 Dr.Kureha", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08DrKureha015);
  });
});
