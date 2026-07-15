import { describe, test } from "vite-plus/test";
import { op13Vegapunk112 } from "../../../../../cards/src/cards/OP13/characters/112-vegapunk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-112 Vegapunk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Vegapunk112);
  });
});
