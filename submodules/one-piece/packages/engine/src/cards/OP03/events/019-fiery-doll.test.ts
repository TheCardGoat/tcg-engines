import { describe, test } from "vite-plus/test";
import { op03FieryDoll019 } from "../../../../../cards/src/cards/OP03/events/019-fiery-doll.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-019 Fiery Doll", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03FieryDoll019);
  });
});
