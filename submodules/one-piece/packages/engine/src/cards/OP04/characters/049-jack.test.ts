import { describe, test } from "vite-plus/test";
import { op04Jack049 } from "../../../../../cards/src/cards/OP04/characters/049-jack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-049 Jack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Jack049);
  });
});
