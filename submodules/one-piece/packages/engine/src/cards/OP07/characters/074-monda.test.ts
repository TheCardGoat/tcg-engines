import { describe, test } from "vite-plus/test";
import { op07Monda074 } from "../../../../../cards/src/cards/characters/op07-074-monda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-074 Monda", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Monda074);
  });
});
