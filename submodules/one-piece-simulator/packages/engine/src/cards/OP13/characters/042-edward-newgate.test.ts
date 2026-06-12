import { describe, test } from "vite-plus/test";
import { op13EdwardNewgate042 } from "../../../../../cards/src/cards/OP13/characters/042-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-042 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13EdwardNewgate042);
  });
});
