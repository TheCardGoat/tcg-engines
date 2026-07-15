import { describe, test } from "vite-plus/test";
import { op08Musshuru011 } from "../../../../../cards/src/cards/OP08/characters/011-musshuru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-011 Musshuru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Musshuru011);
  });
});
