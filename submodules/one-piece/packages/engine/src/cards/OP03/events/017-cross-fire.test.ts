import { describe, test } from "vite-plus/test";
import { op03CrossFire017 } from "../../../../../cards/src/cards/OP03/events/017-cross-fire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-017 Cross Fire", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CrossFire017);
  });
});
