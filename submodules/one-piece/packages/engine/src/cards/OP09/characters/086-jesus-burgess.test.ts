import { describe, test } from "vite-plus/test";
import { op09JesusBurgess086 } from "../../../../../cards/src/cards/OP09/characters/086-jesus-burgess.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-086 Jesus Burgess", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09JesusBurgess086);
  });
});
