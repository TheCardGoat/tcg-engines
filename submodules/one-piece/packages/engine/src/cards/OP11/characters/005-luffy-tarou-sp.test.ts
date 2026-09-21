import { describe, test } from "vite-plus/test";
import { op11LuffyTarouSp005 } from "../../../../../cards/src/cards/characters/st18-005-luffy-tarou-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-005 Luffy-Tarou (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LuffyTarouSp005);
  });
});
