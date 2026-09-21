import { describe, test } from "vite-plus/test";
import { op04BadMannersKickCourse016 } from "../../../../../cards/src/cards/events/op04-016-bad-manners-kick-course.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-016 Bad Manners Kick Course", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04BadMannersKickCourse016);
  });
});
