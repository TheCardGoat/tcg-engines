import { describe, test } from "vite-plus/test";
import { op09Heat007 } from "../../../../../cards/src/cards/OP09/characters/007-heat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-007 Heat", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Heat007);
  });
});
