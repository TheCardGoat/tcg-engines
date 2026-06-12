import { describe, test } from "vite-plus/test";
import { op12BoeufBurst060 } from "../../../../../cards/src/cards/OP12/events/060-boeuf-burst.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-060 Boeuf Burst", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BoeufBurst060);
  });
});
