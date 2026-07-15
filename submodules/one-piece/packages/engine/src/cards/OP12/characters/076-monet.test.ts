import { describe, test } from "vite-plus/test";
import { op12Monet076 } from "../../../../../cards/src/cards/OP12/characters/076-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-076 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Monet076);
  });
});
