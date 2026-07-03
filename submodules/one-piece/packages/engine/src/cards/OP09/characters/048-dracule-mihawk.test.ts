import { describe, test } from "vite-plus/test";
import { op09DraculeMihawk048 } from "../../../../../cards/src/cards/OP09/characters/048-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-048 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DraculeMihawk048);
  });
});
