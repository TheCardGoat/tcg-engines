import { describe, test } from "vite-plus/test";
import { op10UsoHachiSp001 } from "../../../../../cards/src/cards/characters/st18-001-uso-hachi-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-001 Uso-Hachi (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10UsoHachiSp001);
  });
});
