import { describe, test } from "vite-plus/test";
import { op14eb04Mr4Babe093 } from "../../../../../cards/src/cards/OP14EB04/characters/093-mr-4-babe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-093 Mr.4(Babe)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr4Babe093);
  });
});
