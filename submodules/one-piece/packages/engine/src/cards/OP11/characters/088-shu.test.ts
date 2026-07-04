import { describe, test } from "vite-plus/test";
import { op11Shu088 } from "../../../../../cards/src/cards/OP11/characters/088-shu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-088 Shu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Shu088);
  });
});
