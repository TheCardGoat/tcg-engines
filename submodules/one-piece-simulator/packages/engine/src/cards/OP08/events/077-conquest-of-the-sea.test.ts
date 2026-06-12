import { describe, test } from "vite-plus/test";
import { op08ConquestOfTheSea077 } from "../../../../../cards/src/cards/OP08/events/077-conquest-of-the-sea.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-077 Conquest of the Sea", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ConquestOfTheSea077);
  });
});
