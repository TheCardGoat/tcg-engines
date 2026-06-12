import { describe, test } from "vite-plus/test";
import { op03Kaku080 } from "../../../../../cards/src/cards/OP03/characters/080-kaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-080 Kaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kaku080);
  });
});
