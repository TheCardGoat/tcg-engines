import { describe, test } from "vite-plus/test";
import { op12Sanji070 } from "../../../../../cards/src/cards/OP12/characters/070-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-070 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sanji070);
  });
});
