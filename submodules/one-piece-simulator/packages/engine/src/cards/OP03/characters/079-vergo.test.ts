import { describe, test } from "vite-plus/test";
import { op03Vergo079 } from "../../../../../cards/src/cards/OP03/characters/079-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-079 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Vergo079);
  });
});
