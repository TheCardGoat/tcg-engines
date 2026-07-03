import { describe, test } from "vite-plus/test";
import { op05ItSAWasteOfHumanLife058 } from "../../../../../cards/src/cards/OP05/events/058-it-s-a-waste-of-human-life.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-058 It's a Waste of Human Life!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05ItSAWasteOfHumanLife058);
  });
});
