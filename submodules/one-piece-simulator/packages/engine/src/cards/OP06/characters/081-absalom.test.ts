import { describe, test } from "vite-plus/test";
import { op06Absalom081 } from "../../../../../cards/src/cards/OP06/characters/081-absalom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-081 Absalom", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Absalom081);
  });
});
