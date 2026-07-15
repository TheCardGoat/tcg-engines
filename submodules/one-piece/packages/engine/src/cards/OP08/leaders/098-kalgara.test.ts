import { describe, test } from "vite-plus/test";
import { op08Kalgara098 } from "../../../../../cards/src/cards/OP08/leaders/098-kalgara.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-098 Kalgara", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kalgara098);
  });
});
