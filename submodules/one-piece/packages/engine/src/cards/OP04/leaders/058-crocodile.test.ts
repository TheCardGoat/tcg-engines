import { describe, test } from "vite-plus/test";
import { op04Crocodile058 } from "../../../../../cards/src/cards/OP04/leaders/058-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-058 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Crocodile058);
  });
});
