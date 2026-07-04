import { describe, test } from "vite-plus/test";
import { op11Gotti050 } from "../../../../../cards/src/cards/OP11/characters/050-gotti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-050 Gotti", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Gotti050);
  });
});
