import { describe, test } from "vite-plus/test";
import { op06Kuzan045 } from "../../../../../cards/src/cards/characters/op06-045-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-045 Kuzan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kuzan045);
  });
});
