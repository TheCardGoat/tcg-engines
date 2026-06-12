import { describe, test } from "vite-plus/test";
import { op12Issho082 } from "../../../../../cards/src/cards/OP12/characters/082-issho.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-082 Issho", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Issho082);
  });
});
