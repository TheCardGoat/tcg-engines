import { describe, test } from "vite-plus/test";
import { op13Vista046 } from "../../../../../cards/src/cards/OP13/characters/046-vista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-046 Vista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Vista046);
  });
});
