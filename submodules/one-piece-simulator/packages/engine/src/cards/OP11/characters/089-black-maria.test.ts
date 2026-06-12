import { describe, test } from "vite-plus/test";
import { op11BlackMaria089 } from "../../../../../cards/src/cards/OP11/characters/089-black-maria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-089 Black Maria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11BlackMaria089);
  });
});
