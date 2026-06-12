import { describe, test } from "vite-plus/test";
import { op13GoAllTheWayToTheTop077 } from "../../../../../cards/src/cards/OP13/events/077-go-all-the-way-to-the-top.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-077 Go All the Way to the Top!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GoAllTheWayToTheTop077);
  });
});
