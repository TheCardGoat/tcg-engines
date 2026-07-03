import { describe, test } from "vite-plus/test";
import { op13Napoleon070 } from "../../../../../cards/src/cards/OP13/characters/070-napoleon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-070 Napoleon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Napoleon070);
  });
});
