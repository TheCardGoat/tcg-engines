import { describe, test } from "vite-plus/test";
import { op03Camie101 } from "../../../../../cards/src/cards/characters/op03-101-camie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-101 Camie", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Camie101);
  });
});
