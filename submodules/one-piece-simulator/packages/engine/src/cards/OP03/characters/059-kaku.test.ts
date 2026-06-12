import { describe, test } from "vite-plus/test";
import { op03Kaku059 } from "../../../../../cards/src/cards/OP03/characters/059-kaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-059 Kaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kaku059);
  });
});
