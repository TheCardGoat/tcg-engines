import { describe, test } from "vite-plus/test";
import { op03CharlotteLinlin077 } from "../../../../../cards/src/cards/leaders/op03-077-charlotte-linlin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-077 Charlotte Linlin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteLinlin077);
  });
});
