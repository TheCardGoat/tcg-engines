import { describe, test } from "vite-plus/test";
import { op13Shanks028 } from "../../../../../cards/src/cards/OP13/characters/028-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-028 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Shanks028);
  });
});
