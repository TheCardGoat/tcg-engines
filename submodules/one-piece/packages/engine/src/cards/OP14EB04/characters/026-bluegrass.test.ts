import { describe, test } from "vite-plus/test";
import { op14eb04Bluegrass026 } from "../../../../../cards/src/cards/OP14EB04/characters/026-bluegrass.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-026 Bluegrass", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Bluegrass026);
  });
});
