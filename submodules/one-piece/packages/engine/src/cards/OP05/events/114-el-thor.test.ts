import { describe, test } from "vite-plus/test";
import { op05ElThor114 } from "../../../../../cards/src/cards/events/op05-114-el-thor.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-114 El Thor", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ElThor114);
  });
});
