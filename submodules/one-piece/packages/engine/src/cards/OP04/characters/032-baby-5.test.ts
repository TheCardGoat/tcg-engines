import { describe, test } from "vite-plus/test";
import { op04Baby5032 } from "../../../../../cards/src/cards/OP04/characters/032-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-032 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Baby5032);
  });
});
