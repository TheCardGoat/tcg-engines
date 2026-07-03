import { describe, test } from "vite-plus/test";
import { op12Carne066 } from "../../../../../cards/src/cards/OP12/characters/066-carne.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-066 Carne", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Carne066);
  });
});
