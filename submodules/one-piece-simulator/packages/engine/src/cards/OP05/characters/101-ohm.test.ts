import { describe, test } from "vite-plus/test";
import { op05Ohm101 } from "../../../../../cards/src/cards/OP05/characters/101-ohm.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-101 Ohm", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Ohm101);
  });
});
