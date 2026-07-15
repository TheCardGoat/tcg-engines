import { describe, test } from "vite-plus/test";
import { op01Shachi044 } from "../../../../../cards/src/cards/OP01/characters/044-shachi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-044 Shachi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Shachi044);
  });
});
