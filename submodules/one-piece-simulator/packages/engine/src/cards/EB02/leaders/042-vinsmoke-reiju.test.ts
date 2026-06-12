import { describe, test } from "vite-plus/test";
import { eb02VinsmokeReiju042 } from "../../../../../cards/src/cards/EB02/leaders/042-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-042 Vinsmoke Reiju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02VinsmokeReiju042);
  });
});
