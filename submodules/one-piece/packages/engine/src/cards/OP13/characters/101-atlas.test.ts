import { describe, test } from "vite-plus/test";
import { op13Atlas101 } from "../../../../../cards/src/cards/OP13/characters/101-atlas.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-101 Atlas", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Atlas101);
  });
});
