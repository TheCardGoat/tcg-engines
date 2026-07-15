import { describe, test } from "vite-plus/test";
import { op13Higuma013 } from "../../../../../cards/src/cards/OP13/characters/013-higuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-013 Higuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Higuma013);
  });
});
