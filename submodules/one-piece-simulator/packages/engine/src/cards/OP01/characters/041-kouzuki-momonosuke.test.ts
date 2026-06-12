import { describe, test } from "vite-plus/test";
import { op01KouzukiMomonosuke041 } from "../../../../../cards/src/cards/OP01/characters/041-kouzuki-momonosuke.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-041 Kouzuki Momonosuke", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KouzukiMomonosuke041);
  });
});
