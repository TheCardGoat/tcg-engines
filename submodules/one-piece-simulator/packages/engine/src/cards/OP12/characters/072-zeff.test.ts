import { describe, test } from "vite-plus/test";
import { op12Zeff072 } from "../../../../../cards/src/cards/OP12/characters/072-zeff.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-072 Zeff", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Zeff072);
  });
});
