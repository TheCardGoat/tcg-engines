import { describe, test } from "vite-plus/test";
import { op02Daifugo078 } from "../../../../../cards/src/cards/OP02/characters/078-daifugo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-078 Daifugo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Daifugo078);
  });
});
