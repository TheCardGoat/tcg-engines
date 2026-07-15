import { describe, test } from "vite-plus/test";
import { op14eb04Mr9095 } from "../../../../../cards/src/cards/OP14EB04/characters/095-mr-9.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-095 Mr.9", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr9095);
  });
});
