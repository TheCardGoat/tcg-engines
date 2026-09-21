import { describe, test } from "vite-plus/test";
import { op07DraculeMihawk044 } from "../../../../../cards/src/cards/characters/op07-044-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-044 Dracule Mihawk", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DraculeMihawk044);
  });
});
