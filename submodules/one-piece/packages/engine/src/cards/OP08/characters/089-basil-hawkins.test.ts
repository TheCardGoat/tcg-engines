import { describe, test } from "vite-plus/test";
import { op08BasilHawkins089 } from "../../../../../cards/src/cards/OP08/characters/089-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-089 Basil Hawkins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BasilHawkins089);
  });
});
