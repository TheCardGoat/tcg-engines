import { describe, test } from "vite-plus/test";
import { op11LuffyTarouSp005 } from "../../../../../cards/src/cards/OP11/characters/005-luffy-tarou-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-005 Luffy-Tarou (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LuffyTarouSp005);
  });
});
