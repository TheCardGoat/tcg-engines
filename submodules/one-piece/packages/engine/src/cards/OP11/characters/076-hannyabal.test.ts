import { describe, test } from "vite-plus/test";
import { op11Hannyabal076 } from "../../../../../cards/src/cards/OP11/characters/076-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-076 Hannyabal", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Hannyabal076);
  });
});
