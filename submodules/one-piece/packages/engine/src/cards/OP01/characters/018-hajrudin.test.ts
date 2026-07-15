import { describe, test } from "vite-plus/test";
import { op01Hajrudin018 } from "../../../../../cards/src/cards/OP01/characters/018-hajrudin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-018 Hajrudin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Hajrudin018);
  });
});
