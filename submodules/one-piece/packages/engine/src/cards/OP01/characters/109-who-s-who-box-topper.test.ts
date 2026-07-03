import { describe, test } from "vite-plus/test";
import { op01WhoSWhoBoxTopper109 } from "../../../../../cards/src/cards/OP01/characters/109-who-s-who-box-topper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-109 Who's.Who (Box Topper)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01WhoSWhoBoxTopper109);
  });
});
