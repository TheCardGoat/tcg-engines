import { describe, test } from "vite-plus/test";
import { op02Buggy058 } from "../../../../../cards/src/cards/OP02/characters/058-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-058 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Buggy058);
  });
});
