import { describe, test } from "vite-plus/test";
import { op12BoeufBurst060 } from "../../../../../cards/src/cards/events/op12-060-boeuf-burst.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-060 Boeuf Burst", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BoeufBurst060);
  });
});
