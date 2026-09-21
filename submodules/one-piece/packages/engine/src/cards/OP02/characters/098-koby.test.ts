import { describe, test } from "vite-plus/test";
import { op02Koby098 } from "../../../../../cards/src/cards/characters/op02-098-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-098 Koby", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Koby098);
  });
});
