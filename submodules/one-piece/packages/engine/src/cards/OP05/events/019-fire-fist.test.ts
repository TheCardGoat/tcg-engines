import { describe, test } from "vite-plus/test";
import { op05FireFist019 } from "../../../../../cards/src/cards/events/op05-019-fire-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-019 Fire Fist", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05FireFist019);
  });
});
