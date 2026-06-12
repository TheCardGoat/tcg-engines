import { describe, test } from "vite-plus/test";
import { op10BasilHawkins109 } from "../../../../../cards/src/cards/OP10/characters/109-basil-hawkins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-109 Basil Hawkins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10BasilHawkins109);
  });
});
