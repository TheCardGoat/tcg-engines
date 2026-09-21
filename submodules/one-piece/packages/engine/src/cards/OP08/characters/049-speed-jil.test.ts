import { describe, test } from "vite-plus/test";
import { op08SpeedJil049 } from "../../../../../cards/src/cards/characters/op08-049-speed-jil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-049 Speed Jil", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SpeedJil049);
  });
});
