import { describe, test } from "vite-plus/test";
import { op10Room117 } from "../../../../../cards/src/cards/OP10/events/117-room.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-117 ROOM", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Room117);
  });
});
