import { describe, test } from "vite-plus/test";
import { op13AceSaboLuffy007 } from "../../../../../cards/src/cards/OP13/characters/007-ace-sabo-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-007 Ace & Sabo & Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13AceSaboLuffy007);
  });
});
