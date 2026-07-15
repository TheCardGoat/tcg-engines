import { describe, test } from "vite-plus/test";
import { op05BasilHawkins047 } from "../../../../../cards/src/cards/OP05/characters/047-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-047 Basil Hawkins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BasilHawkins047);
  });
});
