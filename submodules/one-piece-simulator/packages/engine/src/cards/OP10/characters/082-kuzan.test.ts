import { describe, test } from "vite-plus/test";
import { op10Kuzan082 } from "../../../../../cards/src/cards/OP10/characters/082-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-082 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Kuzan082);
  });
});
