import { describe, test } from "vite-plus/test";
import { op12Vergo064 } from "../../../../../cards/src/cards/OP12/characters/064-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-064 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Vergo064);
  });
});
