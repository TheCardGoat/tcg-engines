import { describe, test } from "vite-plus/test";
import { op05Bastille048 } from "../../../../../cards/src/cards/OP05/characters/048-bastille.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-048 Bastille", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Bastille048);
  });
});
