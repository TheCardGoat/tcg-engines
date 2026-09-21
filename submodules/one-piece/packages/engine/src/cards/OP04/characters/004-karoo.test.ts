import { describe, test } from "vite-plus/test";
import { op04Karoo004 } from "../../../../../cards/src/cards/characters/op04-004-karoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-004 Karoo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Karoo004);
  });
});
