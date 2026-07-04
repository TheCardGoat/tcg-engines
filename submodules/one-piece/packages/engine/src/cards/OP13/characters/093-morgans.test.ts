import { describe, test } from "vite-plus/test";
import { op13Morgans093 } from "../../../../../cards/src/cards/OP13/characters/093-morgans.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-093 Morgans", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Morgans093);
  });
});
