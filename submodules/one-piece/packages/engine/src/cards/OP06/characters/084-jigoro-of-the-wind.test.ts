import { describe, test } from "vite-plus/test";
import { op06JigoroOfTheWind084 } from "../../../../../cards/src/cards/OP06/characters/084-jigoro-of-the-wind.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-084 Jigoro of the Wind", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06JigoroOfTheWind084);
  });
});
