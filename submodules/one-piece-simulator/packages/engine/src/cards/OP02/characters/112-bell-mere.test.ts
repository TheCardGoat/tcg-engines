import { describe, test } from "vite-plus/test";
import { op02BellMere112 } from "../../../../../cards/src/cards/OP02/characters/112-bell-mere.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-112 Bell-mere", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02BellMere112);
  });
});
