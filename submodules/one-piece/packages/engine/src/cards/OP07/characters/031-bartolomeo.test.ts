import { describe, test } from "vite-plus/test";
import { op07Bartolomeo031 } from "../../../../../cards/src/cards/characters/op07-031-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-031 Bartolomeo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Bartolomeo031);
  });
});
