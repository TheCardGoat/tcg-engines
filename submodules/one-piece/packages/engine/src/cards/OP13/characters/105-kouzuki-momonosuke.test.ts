import { describe, test } from "vite-plus/test";
import { op13KouzukiMomonosuke105 } from "../../../../../cards/src/cards/OP13/characters/105-kouzuki-momonosuke.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-105 Kouzuki Momonosuke", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13KouzukiMomonosuke105);
  });
});
