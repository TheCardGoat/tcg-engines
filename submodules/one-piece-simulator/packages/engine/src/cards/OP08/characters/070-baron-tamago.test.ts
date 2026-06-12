import { describe, test } from "vite-plus/test";
import { op08BaronTamago070 } from "../../../../../cards/src/cards/OP08/characters/070-baron-tamago.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-070 Baron Tamago", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BaronTamago070);
  });
});
