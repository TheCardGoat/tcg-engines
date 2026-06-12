import { describe, test } from "vite-plus/test";
import { op12Morley093 } from "../../../../../cards/src/cards/OP12/characters/093-morley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-093 Morley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Morley093);
  });
});
