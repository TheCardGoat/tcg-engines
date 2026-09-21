import { describe, test } from "vite-plus/test";
import { op07Capote063 } from "../../../../../cards/src/cards/characters/op07-063-capote.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-063 Capote", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Capote063);
  });
});
