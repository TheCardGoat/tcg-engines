import { describe, test } from "vite-plus/test";
import { op07Bluejam011 } from "../../../../../cards/src/cards/OP07/characters/011-bluejam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-011 Bluejam", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Bluejam011);
  });
});
