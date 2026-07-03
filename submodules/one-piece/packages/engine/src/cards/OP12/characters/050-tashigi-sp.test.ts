import { describe, test } from "vite-plus/test";
import { op12TashigiSp050 } from "../../../../../cards/src/cards/OP12/characters/050-tashigi-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-050 Tashigi (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12TashigiSp050);
  });
});
