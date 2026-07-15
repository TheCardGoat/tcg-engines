import { describe, test } from "vite-plus/test";
import { op07IsshoSp078 } from "../../../../../cards/src/cards/OP07/characters/078-issho-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-078 Issho (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07IsshoSp078);
  });
});
