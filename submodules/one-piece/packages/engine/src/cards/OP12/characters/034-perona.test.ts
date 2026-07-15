import { describe, test } from "vite-plus/test";
import { op12Perona034 } from "../../../../../cards/src/cards/OP12/characters/034-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-034 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Perona034);
  });
});
