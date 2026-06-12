import { describe, test } from "vite-plus/test";
import { op01Urashima092 } from "../../../../../cards/src/cards/OP01/characters/092-urashima.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-092 Urashima", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Urashima092);
  });
});
