import { describe, test } from "vite-plus/test";
import { op11PrinceGrus013 } from "../../../../../cards/src/cards/OP11/characters/013-prince-grus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-013 Prince Grus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11PrinceGrus013);
  });
});
