import { describe, test } from "vite-plus/test";
import { op10Bartolomeo052 } from "../../../../../cards/src/cards/OP10/characters/052-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-052 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Bartolomeo052);
  });
});
