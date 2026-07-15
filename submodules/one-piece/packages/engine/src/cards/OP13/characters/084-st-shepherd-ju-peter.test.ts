import { describe, test } from "vite-plus/test";
import { op13StShepherdJuPeter084 } from "../../../../../cards/src/cards/OP13/characters/084-st-shepherd-ju-peter.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-084 St. Shepherd Ju Peter", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13StShepherdJuPeter084);
  });
});
