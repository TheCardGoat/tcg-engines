import { describe, test } from "vite-plus/test";
import { op14eb04Disappointed099 } from "../../../../../cards/src/cards/events/op14-099-disappointed.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-099 Disappointed?", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Disappointed099);
  });
});
