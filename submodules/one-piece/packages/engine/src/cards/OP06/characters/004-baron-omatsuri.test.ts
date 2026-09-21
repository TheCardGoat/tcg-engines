import { describe, test } from "vite-plus/test";
import { op06BaronOmatsuri004 } from "../../../../../cards/src/cards/characters/op06-004-baron-omatsuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-004 Baron Omatsuri", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BaronOmatsuri004);
  });
});
