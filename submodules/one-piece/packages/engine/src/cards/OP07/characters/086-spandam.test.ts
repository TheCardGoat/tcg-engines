import { describe, test } from "vite-plus/test";
import { op07Spandam086 } from "../../../../../cards/src/cards/OP07/characters/086-spandam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-086 Spandam", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Spandam086);
  });
});
