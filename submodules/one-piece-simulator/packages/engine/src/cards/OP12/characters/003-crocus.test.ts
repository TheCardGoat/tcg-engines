import { describe, test } from "vite-plus/test";
import { op12Crocus003 } from "../../../../../cards/src/cards/OP12/characters/003-crocus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-003 Crocus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Crocus003);
  });
});
