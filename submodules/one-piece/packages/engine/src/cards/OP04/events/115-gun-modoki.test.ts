import { describe, test } from "vite-plus/test";
import { op04GunModoki115 } from "../../../../../cards/src/cards/OP04/events/115-gun-modoki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-115 Gun Modoki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04GunModoki115);
  });
});
