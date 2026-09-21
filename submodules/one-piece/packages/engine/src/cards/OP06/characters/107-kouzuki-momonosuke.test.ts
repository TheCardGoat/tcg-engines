import { describe, test } from "vite-plus/test";
import { op06KouzukiMomonosuke107 } from "../../../../../cards/src/cards/characters/op06-107-kouzuki-momonosuke.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-107 Kouzuki Momonosuke", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06KouzukiMomonosuke107);
  });
});
