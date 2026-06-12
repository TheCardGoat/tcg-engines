import { describe, test } from "vite-plus/test";
import { op03SpeedJil006 } from "../../../../../cards/src/cards/OP03/characters/006-speed-jil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-006 Speed Jil", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03SpeedJil006);
  });
});
