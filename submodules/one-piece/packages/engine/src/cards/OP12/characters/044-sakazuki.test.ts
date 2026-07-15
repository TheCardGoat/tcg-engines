import { describe, test } from "vite-plus/test";
import { op12Sakazuki044 } from "../../../../../cards/src/cards/OP12/characters/044-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-044 Sakazuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sakazuki044);
  });
});
