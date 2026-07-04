import { describe, test } from "vite-plus/test";
import { op06Hammond032 } from "../../../../../cards/src/cards/OP06/characters/032-hammond.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-032 Hammond", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Hammond032);
  });
});
