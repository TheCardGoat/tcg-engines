import { describe, test } from "vite-plus/test";
import { op13LittleoarsJr056 } from "../../../../../cards/src/cards/OP13/characters/056-littleoars-jr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-056 LittleOars Jr.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13LittleoarsJr056);
  });
});
