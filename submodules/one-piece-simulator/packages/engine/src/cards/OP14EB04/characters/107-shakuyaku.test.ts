import { describe, test } from "vite-plus/test";
import { op14eb04Shakuyaku107 } from "../../../../../cards/src/cards/OP14EB04/characters/107-shakuyaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-107 Shakuyaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Shakuyaku107);
  });
});
