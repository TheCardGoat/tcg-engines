import { describe, test } from "vite-plus/test";
import { op11Decuplets078 } from "../../../../../cards/src/cards/OP11/characters/078-decuplets.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-078 Decuplets", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Decuplets078);
  });
});
