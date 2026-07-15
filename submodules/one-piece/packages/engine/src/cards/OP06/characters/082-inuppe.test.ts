import { describe, test } from "vite-plus/test";
import { op06Inuppe082 } from "../../../../../cards/src/cards/OP06/characters/082-inuppe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-082 Inuppe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Inuppe082);
  });
});
