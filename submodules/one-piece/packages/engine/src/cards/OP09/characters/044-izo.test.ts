import { describe, test } from "vite-plus/test";
import { op09Izo044 } from "../../../../../cards/src/cards/OP09/characters/044-izo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-044 Izo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Izo044);
  });
});
