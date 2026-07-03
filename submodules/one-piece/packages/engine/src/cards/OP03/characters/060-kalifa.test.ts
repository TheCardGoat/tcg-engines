import { describe, test } from "vite-plus/test";
import { op03Kalifa060 } from "../../../../../cards/src/cards/OP03/characters/060-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-060 Kalifa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kalifa060);
  });
});
