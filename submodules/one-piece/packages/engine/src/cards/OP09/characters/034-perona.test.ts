import { describe, test } from "vite-plus/test";
import { op09Perona034 } from "../../../../../cards/src/cards/OP09/characters/034-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-034 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Perona034);
  });
});
