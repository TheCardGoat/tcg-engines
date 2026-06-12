import { describe, test } from "vite-plus/test";
import { op01Krieg066 } from "../../../../../cards/src/cards/OP01/characters/066-krieg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-066 Krieg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Krieg066);
  });
});
