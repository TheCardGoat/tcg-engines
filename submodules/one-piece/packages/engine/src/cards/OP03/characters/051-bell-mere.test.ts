import { describe, test } from "vite-plus/test";
import { op03BellMere051 } from "../../../../../cards/src/cards/characters/op03-051-bell-mere.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-051 Bell-mere", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03BellMere051);
  });
});
