import { describe, test } from "vite-plus/test";
import { op03Paulie066 } from "../../../../../cards/src/cards/OP03/characters/066-paulie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-066 Paulie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Paulie066);
  });
});
