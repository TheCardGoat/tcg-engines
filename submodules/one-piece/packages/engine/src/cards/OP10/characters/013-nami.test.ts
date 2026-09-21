import { describe, test } from "vite-plus/test";
import { op10Nami013 } from "../../../../../cards/src/cards/characters/op10-013-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-013 Nami", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Nami013);
  });
});
