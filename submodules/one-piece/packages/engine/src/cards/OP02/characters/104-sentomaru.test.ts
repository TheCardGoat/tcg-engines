import { describe, test } from "vite-plus/test";
import { op02Sentomaru104 } from "../../../../../cards/src/cards/characters/op02-104-sentomaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-104 Sentomaru", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sentomaru104);
  });
});
