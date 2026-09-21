import { describe, test } from "vite-plus/test";
import { op11Shirahoshi022 } from "../../../../../cards/src/cards/leaders/op11-022-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-022 Shirahoshi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Shirahoshi022);
  });
});
