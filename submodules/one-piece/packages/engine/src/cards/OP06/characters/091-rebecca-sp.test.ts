import { describe, test } from "vite-plus/test";
import { op06RebeccaSp091 } from "../../../../../cards/src/cards/OP06/characters/091-rebecca-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-091 Rebecca (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06RebeccaSp091);
  });
});
