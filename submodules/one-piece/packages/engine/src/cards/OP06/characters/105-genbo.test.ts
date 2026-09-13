import { describe, test } from "vite-plus/test";
import { op06Genbo105 } from "../../../../../cards/src/cards/OP06/characters/105-genbo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-105 Genbo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Genbo105);
  });
});
