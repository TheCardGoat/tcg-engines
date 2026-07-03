import { describe, test } from "vite-plus/test";
import { op06Kuzan045 } from "../../../../../cards/src/cards/OP06/characters/045-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-045 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kuzan045);
  });
});
