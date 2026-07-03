import { describe, test } from "vite-plus/test";
import { op06Shuraiya009 } from "../../../../../cards/src/cards/OP06/characters/009-shuraiya.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-009 Shuraiya", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Shuraiya009);
  });
});
