import { describe, test } from "vite-plus/test";
import { op10Foxy075 } from "../../../../../cards/src/cards/OP10/characters/075-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-075 Foxy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Foxy075);
  });
});
