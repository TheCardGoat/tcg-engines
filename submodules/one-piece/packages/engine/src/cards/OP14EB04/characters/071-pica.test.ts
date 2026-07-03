import { describe, test } from "vite-plus/test";
import { op14eb04Pica071 } from "../../../../../cards/src/cards/OP14EB04/characters/071-pica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-071 Pica", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Pica071);
  });
});
