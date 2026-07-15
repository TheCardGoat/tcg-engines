import { describe, test } from "vite-plus/test";
import { op09Hongo011 } from "../../../../../cards/src/cards/OP09/characters/011-hongo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-011 Hongo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Hongo011);
  });
});
