import { describe, test } from "vite-plus/test";
import { op03Spandam086 } from "../../../../../cards/src/cards/OP03/characters/086-spandam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-086 Spandam", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Spandam086);
  });
});
