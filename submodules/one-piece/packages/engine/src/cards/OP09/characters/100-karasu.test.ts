import { describe, test } from "vite-plus/test";
import { op09Karasu100 } from "../../../../../cards/src/cards/OP09/characters/100-karasu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-100 Karasu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Karasu100);
  });
});
