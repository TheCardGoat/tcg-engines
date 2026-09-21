import { describe, test } from "vite-plus/test";
import { op02BellMere112 } from "../../../../../cards/src/cards/characters/op02-112-bell-mere.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-112 Bell-mere", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02BellMere112);
  });
});
