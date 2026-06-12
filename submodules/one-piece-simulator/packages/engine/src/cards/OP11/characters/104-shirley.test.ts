import { describe, test } from "vite-plus/test";
import { op11Shirley104 } from "../../../../../cards/src/cards/OP11/characters/104-shirley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-104 Shirley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Shirley104);
  });
});
