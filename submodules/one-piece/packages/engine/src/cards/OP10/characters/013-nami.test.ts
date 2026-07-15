import { describe, test } from "vite-plus/test";
import { op10Nami013 } from "../../../../../cards/src/cards/OP10/characters/013-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-013 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Nami013);
  });
});
