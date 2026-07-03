import { describe, test } from "vite-plus/test";
import { op06Kawamatsu103 } from "../../../../../cards/src/cards/OP06/characters/103-kawamatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-103 Kawamatsu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kawamatsu103);
  });
});
