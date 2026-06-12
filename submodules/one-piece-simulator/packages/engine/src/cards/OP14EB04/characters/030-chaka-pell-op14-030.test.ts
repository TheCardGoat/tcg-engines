import { describe, test } from "vite-plus/test";
import { op14eb04ChakaPellOp14030030 } from "../../../../../cards/src/cards/OP14EB04/characters/030-chaka-pell-op14-030.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-030 Chaka & Pell - OP14-030", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ChakaPellOp14030030);
  });
});
