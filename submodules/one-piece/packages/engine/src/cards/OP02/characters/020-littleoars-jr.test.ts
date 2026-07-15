import { describe, test } from "vite-plus/test";
import { op02LittleoarsJr020 } from "../../../../../cards/src/cards/OP02/characters/020-littleoars-jr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-020 LittleOars Jr.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02LittleoarsJr020);
  });
});
