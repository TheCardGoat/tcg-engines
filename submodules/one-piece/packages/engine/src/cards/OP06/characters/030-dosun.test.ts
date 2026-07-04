import { describe, test } from "vite-plus/test";
import { op06Dosun030 } from "../../../../../cards/src/cards/OP06/characters/030-dosun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-030 Dosun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Dosun030);
  });
});
