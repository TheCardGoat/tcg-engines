import { describe, test } from "vite-plus/test";
import { op04Issho020 } from "../../../../../cards/src/cards/OP04/leaders/020-issho.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-020 Issho", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Issho020);
  });
});
