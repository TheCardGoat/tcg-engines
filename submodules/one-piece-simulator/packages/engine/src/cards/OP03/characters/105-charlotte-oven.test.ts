import { describe, test } from "vite-plus/test";
import { op03CharlotteOven105 } from "../../../../../cards/src/cards/OP03/characters/105-charlotte-oven.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-105 Charlotte Oven", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteOven105);
  });
});
