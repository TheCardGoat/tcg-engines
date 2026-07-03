import { describe, test } from "vite-plus/test";
import { op13Helmeppo036 } from "../../../../../cards/src/cards/OP13/characters/036-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-036 Helmeppo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Helmeppo036);
  });
});
