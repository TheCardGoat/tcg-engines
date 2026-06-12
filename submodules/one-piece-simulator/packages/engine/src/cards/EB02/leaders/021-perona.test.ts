import { describe, test } from "vite-plus/test";
import { eb02Perona021 } from "../../../../../cards/src/cards/EB02/leaders/021-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-021 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Perona021);
  });
});
