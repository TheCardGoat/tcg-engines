import { describe, test } from "vite-plus/test";
import { op09Kuzan101 } from "../../../../../cards/src/cards/OP09/characters/101-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-101 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Kuzan101);
  });
});
