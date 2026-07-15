import { describe, test } from "vite-plus/test";
import { op11LongJawNeptunian103 } from "../../../../../cards/src/cards/OP11/characters/103-long-jaw-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-103 Long-Jaw Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LongJawNeptunian103);
  });
});
