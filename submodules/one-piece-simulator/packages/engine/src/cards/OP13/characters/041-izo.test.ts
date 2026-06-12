import { describe, test } from "vite-plus/test";
import { op13Izo041 } from "../../../../../cards/src/cards/OP13/characters/041-izo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-041 Izo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Izo041);
  });
});
