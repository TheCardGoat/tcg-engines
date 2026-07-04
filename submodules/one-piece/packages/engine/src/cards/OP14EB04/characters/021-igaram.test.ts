import { describe, test } from "vite-plus/test";
import { op14eb04Igaram021 } from "../../../../../cards/src/cards/OP14EB04/characters/021-igaram.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-021 Igaram", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Igaram021);
  });
});
