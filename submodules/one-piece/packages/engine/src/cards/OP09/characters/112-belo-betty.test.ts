import { describe, test } from "vite-plus/test";
import { op09BeloBetty112 } from "../../../../../cards/src/cards/OP09/characters/112-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-112 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BeloBetty112);
  });
});
