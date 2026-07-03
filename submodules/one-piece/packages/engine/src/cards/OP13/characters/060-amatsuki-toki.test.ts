import { describe, test } from "vite-plus/test";
import { op13AmatsukiToki060 } from "../../../../../cards/src/cards/OP13/characters/060-amatsuki-toki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-060 Amatsuki Toki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13AmatsukiToki060);
  });
});
