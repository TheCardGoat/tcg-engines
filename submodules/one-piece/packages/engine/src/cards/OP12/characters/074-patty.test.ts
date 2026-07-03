import { describe, test } from "vite-plus/test";
import { op12Patty074 } from "../../../../../cards/src/cards/OP12/characters/074-patty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-074 Patty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Patty074);
  });
});
