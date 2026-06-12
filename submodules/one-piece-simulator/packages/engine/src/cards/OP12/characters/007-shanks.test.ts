import { describe, test } from "vite-plus/test";
import { op12Shanks007 } from "../../../../../cards/src/cards/OP12/characters/007-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-007 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Shanks007);
  });
});
