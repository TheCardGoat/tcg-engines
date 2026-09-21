import { describe, test } from "vite-plus/test";
import { op01WhoSWhoBoxTopper109 } from "../../../../../cards/src/cards/characters/op01-109-who-s-who-box-topper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-109 Who's.Who (Box Topper)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01WhoSWhoBoxTopper109);
  });
});
