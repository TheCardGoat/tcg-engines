import { describe, test } from "vite-plus/test";
import { op07DragonBreath017 } from "../../../../../cards/src/cards/OP07/events/017-dragon-breath.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-017 Dragon Breath", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DragonBreath017);
  });
});
