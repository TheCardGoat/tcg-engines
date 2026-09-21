import { describe, test } from "vite-plus/test";
import { op06Uta001 } from "../../../../../cards/src/cards/leaders/op06-001-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-001 Uta", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Uta001);
  });
});
