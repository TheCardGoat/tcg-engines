import { describe, test } from "vite-plus/test";
import { op08ClovenRose018 } from "../../../../../cards/src/cards/OP08/events/018-cloven-rose.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-018 Cloven Rose", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ClovenRose018);
  });
});
