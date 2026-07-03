import { describe, test } from "vite-plus/test";
import { op01Sasaki101 } from "../../../../../cards/src/cards/OP01/characters/101-sasaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-101 Sasaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Sasaki101);
  });
});
