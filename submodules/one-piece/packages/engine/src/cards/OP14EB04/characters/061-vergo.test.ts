import { describe, test } from "vite-plus/test";
import { op14eb04Vergo061 } from "../../../../../cards/src/cards/OP14EB04/characters/061-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-061 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Vergo061);
  });
});
