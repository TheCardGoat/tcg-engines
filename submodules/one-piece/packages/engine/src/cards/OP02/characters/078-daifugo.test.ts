import { describe, test } from "vite-plus/test";
import { op02Daifugo078 } from "../../../../../cards/src/cards/characters/op02-078-daifugo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-078 Daifugo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Daifugo078);
  });
});
