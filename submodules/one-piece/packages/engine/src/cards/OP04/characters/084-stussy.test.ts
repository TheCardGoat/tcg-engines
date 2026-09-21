import { describe, test } from "vite-plus/test";
import { op04Stussy084 } from "../../../../../cards/src/cards/characters/op04-084-stussy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-084 Stussy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Stussy084);
  });
});
