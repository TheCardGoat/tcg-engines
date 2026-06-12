import { describe, test } from "vite-plus/test";
import { op06BaronOmatsuri004 } from "../../../../../cards/src/cards/OP06/characters/004-baron-omatsuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-004 Baron Omatsuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BaronOmatsuri004);
  });
});
