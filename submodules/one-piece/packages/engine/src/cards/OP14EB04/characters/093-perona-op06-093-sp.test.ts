import { describe, test } from "vite-plus/test";
import { op14eb04PeronaOp06093Sp093 } from "../../../../../cards/src/cards/OP14EB04/characters/093-perona-op06-093-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-093 Perona - OP06-093 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PeronaOp06093Sp093);
  });
});
