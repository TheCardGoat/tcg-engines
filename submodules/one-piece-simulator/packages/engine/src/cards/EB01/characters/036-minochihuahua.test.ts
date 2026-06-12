import { describe, test } from "vite-plus/test";
import { eb01Minochihuahua036 } from "../../../../../cards/src/cards/EB01/characters/036-minochihuahua.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-036 Minochihuahua", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Minochihuahua036);
  });
});
