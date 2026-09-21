import { describe, test } from "vite-plus/test";
import { op11Jinbe021 } from "../../../../../cards/src/cards/leaders/op11-021-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-021 Jinbe", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Jinbe021);
  });
});
