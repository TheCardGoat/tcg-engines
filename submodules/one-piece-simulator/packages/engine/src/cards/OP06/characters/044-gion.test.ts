import { describe, test } from "vite-plus/test";
import { op06Gion044 } from "../../../../../cards/src/cards/OP06/characters/044-gion.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-044 Gion", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Gion044);
  });
});
