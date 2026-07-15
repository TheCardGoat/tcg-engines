import { describe, test } from "vite-plus/test";
import { op03BellMere051 } from "../../../../../cards/src/cards/OP03/characters/051-bell-mere.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-051 Bell-mere", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03BellMere051);
  });
});
