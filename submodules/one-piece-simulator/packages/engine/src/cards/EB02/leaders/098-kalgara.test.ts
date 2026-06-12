import { describe, test } from "vite-plus/test";
import { eb02Kalgara098 } from "../../../../../cards/src/cards/EB02/leaders/098-kalgara.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-098 Kalgara", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Kalgara098);
  });
});
