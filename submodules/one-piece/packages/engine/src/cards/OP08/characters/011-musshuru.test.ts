import { describe, test } from "vite-plus/test";
import { op08Musshuru011 } from "../../../../../cards/src/cards/characters/op08-011-musshuru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-011 Musshuru", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Musshuru011);
  });
});
