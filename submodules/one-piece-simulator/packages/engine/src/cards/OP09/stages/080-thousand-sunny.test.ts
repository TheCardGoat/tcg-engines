import { describe, test } from "vite-plus/test";
import { op09ThousandSunny080 } from "../../../../../cards/src/cards/OP09/stages/080-thousand-sunny.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-080 Thousand Sunny", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ThousandSunny080);
  });
});
