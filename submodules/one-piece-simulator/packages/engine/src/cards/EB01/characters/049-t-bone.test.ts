import { describe, test } from "vite-plus/test";
import { eb01TBone049 } from "../../../../../cards/src/cards/EB01/characters/049-t-bone.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-049 T-Bone", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01TBone049);
  });
});
