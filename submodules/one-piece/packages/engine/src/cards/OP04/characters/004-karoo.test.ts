import { describe, test } from "vite-plus/test";
import { op04Karoo004 } from "../../../../../cards/src/cards/OP04/characters/004-karoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-004 Karoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Karoo004);
  });
});
