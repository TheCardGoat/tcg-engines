import { describe, test } from "vite-plus/test";
import { op01Nami016 } from "../../../../../cards/src/cards/OP01/characters/016-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-016 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Nami016);
  });
});
