import { describe, test } from "vite-plus/test";
import { op02Sakazuki099 } from "../../../../../cards/src/cards/characters/op02-099-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-099 Sakazuki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sakazuki099);
  });
});
