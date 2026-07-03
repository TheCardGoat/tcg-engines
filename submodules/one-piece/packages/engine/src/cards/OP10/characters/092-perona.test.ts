import { describe, test } from "vite-plus/test";
import { op10Perona092 } from "../../../../../cards/src/cards/OP10/characters/092-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-092 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Perona092);
  });
});
