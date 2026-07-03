import { describe, test } from "vite-plus/test";
import { op03Hatchan033 } from "../../../../../cards/src/cards/OP03/characters/033-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-033 Hatchan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Hatchan033);
  });
});
