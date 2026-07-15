import { describe, test } from "vite-plus/test";
import { op14eb04Disappointed099 } from "../../../../../cards/src/cards/OP14EB04/events/099-disappointed.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-099 Disappointed?", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Disappointed099);
  });
});
