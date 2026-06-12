import { describe, test } from "vite-plus/test";
import { op07DraculeMihawk044 } from "../../../../../cards/src/cards/OP07/characters/044-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-044 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DraculeMihawk044);
  });
});
