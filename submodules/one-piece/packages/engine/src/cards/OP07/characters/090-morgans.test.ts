import { describe, test } from "vite-plus/test";
import { op07Morgans090 } from "../../../../../cards/src/cards/OP07/characters/090-morgans.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-090 Morgans", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Morgans090);
  });
});
