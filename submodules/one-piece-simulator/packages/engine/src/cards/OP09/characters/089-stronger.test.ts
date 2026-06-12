import { describe, test } from "vite-plus/test";
import { op09Stronger089 } from "../../../../../cards/src/cards/OP09/characters/089-stronger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-089 Stronger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Stronger089);
  });
});
