import { describe, test } from "vite-plus/test";
import { op03Kaya044 } from "../../../../../cards/src/cards/OP03/characters/044-kaya.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-044 Kaya", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kaya044);
  });
});
