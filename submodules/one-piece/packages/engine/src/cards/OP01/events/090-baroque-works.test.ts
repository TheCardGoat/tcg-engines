import { describe, test } from "vite-plus/test";
import { op01BaroqueWorks090 } from "../../../../../cards/src/cards/OP01/events/090-baroque-works.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-090 Baroque Works", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BaroqueWorks090);
  });
});
