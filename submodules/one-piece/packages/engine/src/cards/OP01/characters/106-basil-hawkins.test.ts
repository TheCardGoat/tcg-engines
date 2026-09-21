import { describe, test } from "vite-plus/test";
import { op01BasilHawkins106 } from "../../../../../cards/src/cards/characters/op01-106-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-106 Basil Hawkins", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BasilHawkins106);
  });
});
