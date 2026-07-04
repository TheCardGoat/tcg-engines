import { describe, test } from "vite-plus/test";
import { op07Bartolomeo031 } from "../../../../../cards/src/cards/OP07/characters/031-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-031 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Bartolomeo031);
  });
});
