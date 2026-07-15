import { describe, test } from "vite-plus/test";
import { op12Sanji041 } from "../../../../../cards/src/cards/OP12/leaders/041-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-041 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sanji041);
  });
});
