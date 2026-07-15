import { describe, test } from "vite-plus/test";
import { op11Zeus106 } from "../../../../../cards/src/cards/OP11/characters/106-zeus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-106 Zeus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Zeus106);
  });
});
