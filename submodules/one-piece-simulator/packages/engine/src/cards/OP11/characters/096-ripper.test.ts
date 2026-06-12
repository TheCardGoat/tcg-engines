import { describe, test } from "vite-plus/test";
import { op11Ripper096 } from "../../../../../cards/src/cards/OP11/characters/096-ripper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-096 Ripper", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Ripper096);
  });
});
