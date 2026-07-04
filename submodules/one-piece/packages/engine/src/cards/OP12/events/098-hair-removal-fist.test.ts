import { describe, test } from "vite-plus/test";
import { op12HairRemovalFist098 } from "../../../../../cards/src/cards/OP12/events/098-hair-removal-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-098 Hair Removal Fist", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12HairRemovalFist098);
  });
});
