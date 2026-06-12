import { describe, test } from "vite-plus/test";
import { op12DraculeMihawk030 } from "../../../../../cards/src/cards/OP12/characters/030-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-030 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DraculeMihawk030);
  });
});
