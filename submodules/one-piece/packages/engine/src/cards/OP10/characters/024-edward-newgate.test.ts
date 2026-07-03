import { describe, test } from "vite-plus/test";
import { op10EdwardNewgate024 } from "../../../../../cards/src/cards/OP10/characters/024-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-024 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10EdwardNewgate024);
  });
});
