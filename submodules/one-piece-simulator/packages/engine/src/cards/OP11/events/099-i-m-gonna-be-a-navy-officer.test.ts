import { describe, test } from "vite-plus/test";
import { op11IMGonnaBeANavyOfficer099 } from "../../../../../cards/src/cards/OP11/events/099-i-m-gonna-be-a-navy-officer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-099 I'm Gonna Be a Navy Officer!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11IMGonnaBeANavyOfficer099);
  });
});
