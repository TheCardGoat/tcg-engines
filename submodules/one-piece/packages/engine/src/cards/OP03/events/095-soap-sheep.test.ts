import { describe, test } from "vite-plus/test";
import { op03SoapSheep095 } from "../../../../../cards/src/cards/OP03/events/095-soap-sheep.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-095 Soap Sheep", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03SoapSheep095);
  });
});
