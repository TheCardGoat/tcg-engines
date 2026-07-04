import { describe, test } from "vite-plus/test";
import { op11Bins011 } from "../../../../../cards/src/cards/OP11/characters/011-bins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-011 Bins", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Bins011);
  });
});
