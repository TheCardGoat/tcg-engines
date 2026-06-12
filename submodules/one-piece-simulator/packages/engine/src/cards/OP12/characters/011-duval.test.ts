import { describe, test } from "vite-plus/test";
import { op12Duval011 } from "../../../../../cards/src/cards/OP12/characters/011-duval.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-011 Duval", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Duval011);
  });
});
