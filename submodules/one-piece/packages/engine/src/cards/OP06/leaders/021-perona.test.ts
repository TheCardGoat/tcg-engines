import { describe, test } from "vite-plus/test";
import { op06Perona021 } from "../../../../../cards/src/cards/OP06/leaders/021-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-021 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Perona021);
  });
});
