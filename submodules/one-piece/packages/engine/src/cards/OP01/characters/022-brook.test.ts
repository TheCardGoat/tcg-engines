import { describe, test } from "vite-plus/test";
import { op01Brook022 } from "../../../../../cards/src/cards/OP01/characters/022-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-022 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Brook022);
  });
});
