import { describe, test } from "vite-plus/test";
import { op01Bartolomeo019 } from "../../../../../cards/src/cards/OP01/characters/019-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-019 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Bartolomeo019);
  });
});
