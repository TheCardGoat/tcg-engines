import { describe, test } from "vite-plus/test";
import { op12Sabo100 } from "../../../../../cards/src/cards/OP12/characters/100-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-100 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Sabo100);
  });
});
