import { describe, test } from "vite-plus/test";
import { op03Sham027 } from "../../../../../cards/src/cards/OP03/characters/027-sham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-027 Sham", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Sham027);
  });
});
