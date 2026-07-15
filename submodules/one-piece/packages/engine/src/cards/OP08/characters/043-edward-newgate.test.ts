import { describe, test } from "vite-plus/test";
import { op08EdwardNewgate043 } from "../../../../../cards/src/cards/OP08/characters/043-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-043 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08EdwardNewgate043);
  });
});
