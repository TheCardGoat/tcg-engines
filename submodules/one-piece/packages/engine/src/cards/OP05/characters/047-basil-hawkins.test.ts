import { describe, test } from "vite-plus/test";
import { op05BasilHawkins047 } from "../../../../../cards/src/cards/characters/op05-047-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-047 Basil Hawkins", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BasilHawkins047);
  });
});
