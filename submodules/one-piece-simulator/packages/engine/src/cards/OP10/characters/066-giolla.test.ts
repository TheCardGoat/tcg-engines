import { describe, test } from "vite-plus/test";
import { op10Giolla066 } from "../../../../../cards/src/cards/OP10/characters/066-giolla.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-066 Giolla", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Giolla066);
  });
});
