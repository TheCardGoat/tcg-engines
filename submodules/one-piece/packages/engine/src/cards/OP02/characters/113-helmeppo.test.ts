import { describe, test } from "vite-plus/test";
import { op02Helmeppo113 } from "../../../../../cards/src/cards/OP02/characters/113-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-113 Helmeppo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Helmeppo113);
  });
});
