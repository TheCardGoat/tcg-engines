import { describe, test } from "vite-plus/test";
import { op11Hatchan034 } from "../../../../../cards/src/cards/OP11/characters/034-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-034 Hatchan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Hatchan034);
  });
});
