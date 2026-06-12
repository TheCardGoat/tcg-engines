import { describe, test } from "vite-plus/test";
import { op01Wire053 } from "../../../../../cards/src/cards/OP01/characters/053-wire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-053 Wire", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Wire053);
  });
});
