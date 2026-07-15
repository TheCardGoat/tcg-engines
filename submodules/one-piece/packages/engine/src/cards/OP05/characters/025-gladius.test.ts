import { describe, test } from "vite-plus/test";
import { op05Gladius025 } from "../../../../../cards/src/cards/OP05/characters/025-gladius.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-025 Gladius", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Gladius025);
  });
});
