import { describe, test } from "vite-plus/test";
import { eb01EdwardWeevil023 } from "../../../../../cards/src/cards/EB01/characters/023-edward-weevil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-023 Edward Weevil", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01EdwardWeevil023);
  });
});
