import { describe, test } from "vite-plus/test";
import { op12EdwardNewgate002 } from "../../../../../cards/src/cards/OP12/characters/002-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-002 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12EdwardNewgate002);
  });
});
