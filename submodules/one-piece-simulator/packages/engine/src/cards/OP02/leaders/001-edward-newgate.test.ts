import { describe, test } from "vite-plus/test";
import { op02EdwardNewgate001 } from "../../../../../cards/src/cards/OP02/leaders/001-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-001 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02EdwardNewgate001);
  });
});
