import { describe, test } from "vite-plus/test";
import { op10UrougeSp021 } from "../../../../../cards/src/cards/OP10/characters/021-urouge-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-021 Urouge (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10UrougeSp021);
  });
});
