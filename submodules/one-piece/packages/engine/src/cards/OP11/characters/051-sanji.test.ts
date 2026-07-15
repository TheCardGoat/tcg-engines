import { describe, test } from "vite-plus/test";
import { op11Sanji051 } from "../../../../../cards/src/cards/OP11/characters/051-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-051 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Sanji051);
  });
});
