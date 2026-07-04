import { describe, test } from "vite-plus/test";
import { op10DraculeMihawk029 } from "../../../../../cards/src/cards/OP10/characters/029-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-029 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DraculeMihawk029);
  });
});
