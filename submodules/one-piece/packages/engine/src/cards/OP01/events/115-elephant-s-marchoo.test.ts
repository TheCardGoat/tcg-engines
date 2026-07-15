import { describe, test } from "vite-plus/test";
import { op01ElephantSMarchoo115 } from "../../../../../cards/src/cards/OP01/events/115-elephant-s-marchoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-115 Elephant's Marchoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01ElephantSMarchoo115);
  });
});
