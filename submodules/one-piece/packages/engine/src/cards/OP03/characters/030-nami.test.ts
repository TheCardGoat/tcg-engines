import { describe, test } from "vite-plus/test";
import { op03Nami030 } from "../../../../../cards/src/cards/characters/op03-030-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-030 Nami", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Nami030);
  });
});
