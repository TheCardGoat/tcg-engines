import { describe, test } from "vite-plus/test";
import { op06Tashigi050 } from "../../../../../cards/src/cards/OP06/characters/050-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-050 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Tashigi050);
  });
});
