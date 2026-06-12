import { describe, test } from "vite-plus/test";
import { op09Sabo104 } from "../../../../../cards/src/cards/OP09/characters/104-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-104 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sabo104);
  });
});
