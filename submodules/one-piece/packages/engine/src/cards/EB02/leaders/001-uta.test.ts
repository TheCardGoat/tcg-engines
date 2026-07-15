import { describe, test } from "vite-plus/test";
import { eb02Uta001 } from "../../../../../cards/src/cards/EB02/leaders/001-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-001 Uta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Uta001);
  });
});
