import { describe, test } from "vite-plus/test";
import { op13Hack090 } from "../../../../../cards/src/cards/OP13/characters/090-hack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-090 Hack", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Hack090);
  });
});
