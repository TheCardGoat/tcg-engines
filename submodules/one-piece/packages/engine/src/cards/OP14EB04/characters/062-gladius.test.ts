import { describe, test } from "vite-plus/test";
import { op14eb04Gladius062 } from "../../../../../cards/src/cards/OP14EB04/characters/062-gladius.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-062 Gladius", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Gladius062);
  });
});
