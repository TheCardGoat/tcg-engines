import { describe, test } from "vite-plus/test";
import { op03Wanze093 } from "../../../../../cards/src/cards/OP03/characters/093-wanze.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-093 Wanze", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Wanze093);
  });
});
