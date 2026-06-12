import { describe, test } from "vite-plus/test";
import { op13StJaygarciaSaturn083 } from "../../../../../cards/src/cards/OP13/characters/083-st-jaygarcia-saturn.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-083 St. Jaygarcia Saturn", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13StJaygarciaSaturn083);
  });
});
