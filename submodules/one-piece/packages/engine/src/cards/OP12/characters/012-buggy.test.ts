import { describe, test } from "vite-plus/test";
import { op12Buggy012 } from "../../../../../cards/src/cards/OP12/characters/012-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-012 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Buggy012);
  });
});
