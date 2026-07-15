import { describe, test } from "vite-plus/test";
import { op11Pappag109 } from "../../../../../cards/src/cards/OP11/characters/109-pappag.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-109 Pappag", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Pappag109);
  });
});
