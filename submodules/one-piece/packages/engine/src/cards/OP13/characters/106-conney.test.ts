import { describe, test } from "vite-plus/test";
import { op13Conney106 } from "../../../../../cards/src/cards/OP13/characters/106-conney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-106 Conney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Conney106);
  });
});
