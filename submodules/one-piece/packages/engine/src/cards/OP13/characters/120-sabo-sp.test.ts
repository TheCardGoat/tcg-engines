import { describe, test } from "vite-plus/test";
import { op13SaboSp120 } from "../../../../../cards/src/cards/OP13/characters/120-sabo-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-120 Sabo (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaboSp120);
  });
});
