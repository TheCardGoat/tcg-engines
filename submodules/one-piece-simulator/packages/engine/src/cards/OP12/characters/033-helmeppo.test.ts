import { describe, test } from "vite-plus/test";
import { op12Helmeppo033 } from "../../../../../cards/src/cards/OP12/characters/033-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-033 Helmeppo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Helmeppo033);
  });
});
