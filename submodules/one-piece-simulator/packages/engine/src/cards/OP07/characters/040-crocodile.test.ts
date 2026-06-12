import { describe, test } from "vite-plus/test";
import { op07Crocodile040 } from "../../../../../cards/src/cards/OP07/characters/040-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-040 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Crocodile040);
  });
});
