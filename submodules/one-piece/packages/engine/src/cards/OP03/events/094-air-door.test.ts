import { describe, test } from "vite-plus/test";
import { op03AirDoor094 } from "../../../../../cards/src/cards/events/op03-094-air-door.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-094 Air Door", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03AirDoor094);
  });
});
