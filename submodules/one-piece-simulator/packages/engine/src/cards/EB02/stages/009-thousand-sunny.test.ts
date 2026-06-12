import { describe, test } from "vite-plus/test";
import { eb02ThousandSunny009 } from "../../../../../cards/src/cards/EB02/stages/009-thousand-sunny.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-009 Thousand Sunny", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02ThousandSunny009);
  });
});
