import { describe, test } from "vite-plus/test";
import { op12Shanks008 } from "../../../../../cards/src/cards/OP12/characters/008-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-008 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Shanks008);
  });
});
