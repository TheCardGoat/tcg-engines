import { describe, test } from "vite-plus/test";
import { op08Milky032 } from "../../../../../cards/src/cards/OP08/characters/032-milky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-032 Milky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Milky032);
  });
});
