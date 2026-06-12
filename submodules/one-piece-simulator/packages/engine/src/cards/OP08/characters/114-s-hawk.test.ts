import { describe, test } from "vite-plus/test";
import { op08SHawk114 } from "../../../../../cards/src/cards/OP08/characters/114-s-hawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-114 S-Hawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SHawk114);
  });
});
