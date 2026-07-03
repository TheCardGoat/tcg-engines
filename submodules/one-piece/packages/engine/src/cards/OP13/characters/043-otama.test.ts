import { describe, test } from "vite-plus/test";
import { op13Otama043 } from "../../../../../cards/src/cards/OP13/characters/043-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-043 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Otama043);
  });
});
