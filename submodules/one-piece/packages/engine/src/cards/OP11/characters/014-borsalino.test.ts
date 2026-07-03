import { describe, test } from "vite-plus/test";
import { op11Borsalino014 } from "../../../../../cards/src/cards/OP11/characters/014-borsalino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-014 Borsalino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Borsalino014);
  });
});
