import { describe, test } from "vite-plus/test";
import { op12Sentomaru104 } from "../../../../../cards/src/cards/OP12/characters/104-sentomaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-104 Sentomaru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sentomaru104);
  });
});
