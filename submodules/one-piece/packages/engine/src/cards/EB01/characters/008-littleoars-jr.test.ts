import { describe, test } from "vite-plus/test";
import { eb01LittleoarsJr008 } from "../../../../../cards/src/cards/EB01/characters/008-littleoars-jr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-008 LittleOars Jr.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01LittleoarsJr008);
  });
});
