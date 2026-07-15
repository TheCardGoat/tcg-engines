import { describe, test } from "vite-plus/test";
import { op02Sentomaru104 } from "../../../../../cards/src/cards/OP02/characters/104-sentomaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-104 Sentomaru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sentomaru104);
  });
});
