import { describe, test } from "vite-plus/test";
import { op07Atlas098 } from "../../../../../cards/src/cards/characters/op07-098-atlas.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-098 Atlas", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Atlas098);
  });
});
