import { describe, test } from "vite-plus/test";
import { op14eb04Kaido030 } from "../../../../../cards/src/cards/OP14EB04/characters/030-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-030 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Kaido030);
  });
});
