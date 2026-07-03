import { describe, test } from "vite-plus/test";
import { op13NefeltariVivi012 } from "../../../../../cards/src/cards/OP13/characters/012-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-012 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13NefeltariVivi012);
  });
});
