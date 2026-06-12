import { describe, test } from "vite-plus/test";
import { op06CharlotteLinlinSp114 } from "../../../../../cards/src/cards/OP06/characters/114-charlotte-linlin-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-114 Charlotte Linlin (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06CharlotteLinlinSp114);
  });
});
