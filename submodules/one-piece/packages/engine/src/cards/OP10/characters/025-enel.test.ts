import { describe, test } from "vite-plus/test";
import { op10Enel025 } from "../../../../../cards/src/cards/OP10/characters/025-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-025 Enel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Enel025);
  });
});
