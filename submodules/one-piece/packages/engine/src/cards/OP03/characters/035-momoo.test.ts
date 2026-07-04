import { describe, test } from "vite-plus/test";
import { op03Momoo035 } from "../../../../../cards/src/cards/OP03/characters/035-momoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-035 Momoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Momoo035);
  });
});
