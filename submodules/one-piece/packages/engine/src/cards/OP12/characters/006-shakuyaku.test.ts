import { describe, test } from "vite-plus/test";
import { op12Shakuyaku006 } from "../../../../../cards/src/cards/OP12/characters/006-shakuyaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-006 Shakuyaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Shakuyaku006);
  });
});
