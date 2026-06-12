import { describe, test } from "vite-plus/test";
import { op11ScaledNeptunian026 } from "../../../../../cards/src/cards/OP11/characters/026-scaled-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-026 Scaled Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11ScaledNeptunian026);
  });
});
