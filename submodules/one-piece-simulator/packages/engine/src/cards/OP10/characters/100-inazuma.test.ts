import { describe, test } from "vite-plus/test";
import { op10Inazuma100 } from "../../../../../cards/src/cards/OP10/characters/100-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-100 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Inazuma100);
  });
});
