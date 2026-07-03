import { describe, test } from "vite-plus/test";
import { op02DraculeMihawk055 } from "../../../../../cards/src/cards/OP02/characters/055-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-055 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DraculeMihawk055);
  });
});
