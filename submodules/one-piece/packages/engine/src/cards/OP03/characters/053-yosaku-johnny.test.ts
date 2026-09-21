import { describe, test } from "vite-plus/test";
import { op03YosakuJohnny053 } from "../../../../../cards/src/cards/characters/op03-053-yosaku-johnny.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-053 Yosaku & Johnny", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03YosakuJohnny053);
  });
});
