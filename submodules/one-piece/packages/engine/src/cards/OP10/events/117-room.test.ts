import { describe, test } from "vite-plus/test";
import { op10Room117 } from "../../../../../cards/src/cards/events/op10-117-room.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-117 ROOM", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Room117);
  });
});
