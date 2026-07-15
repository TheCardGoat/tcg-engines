import { describe, test } from "vite-plus/test";
import { eb02King057 } from "../../../../../cards/src/cards/EB02/leaders/057-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-057 King", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02King057);
  });
});
