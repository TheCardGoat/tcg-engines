import { describe, test } from "vite-plus/test";
import { op03Kalifa060 } from "../../../../../cards/src/cards/characters/op03-060-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-060 Kalifa", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kalifa060);
  });
});
