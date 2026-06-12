import { describe, test } from "vite-plus/test";
import { op13Haruta045 } from "../../../../../cards/src/cards/OP13/characters/045-haruta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-045 Haruta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Haruta045);
  });
});
