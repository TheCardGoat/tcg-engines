import { describe, test } from "vite-plus/test";
import { op03AirDoor094 } from "../../../../../cards/src/cards/OP03/events/094-air-door.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-094 Air Door", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03AirDoor094);
  });
});
