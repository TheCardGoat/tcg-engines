import { describe, test } from "vite-plus/test";
import { op01Izo033 } from "../../../../../cards/src/cards/OP01/characters/033-izo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-033 Izo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Izo033);
  });
});
