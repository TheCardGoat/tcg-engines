import { describe, test } from "vite-plus/test";
import { op01Okiku035 } from "../../../../../cards/src/cards/OP01/characters/035-okiku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-035 Okiku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Okiku035);
  });
});
