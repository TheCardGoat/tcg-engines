import { describe, test } from "vite-plus/test";
import { op08Lapins012 } from "../../../../../cards/src/cards/characters/op08-012-lapins.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-012 Lapins", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Lapins012);
  });
});
