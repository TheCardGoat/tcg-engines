import { describe, test } from "vite-plus/test";
import { op03Shirley104 } from "../../../../../cards/src/cards/OP03/characters/104-shirley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-104 Shirley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Shirley104);
  });
});
