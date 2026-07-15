import { describe, test } from "vite-plus/test";
import { prb02BadMannersKickCourseReprint016 } from "../../../../../cards/src/cards/PRB02/events/016-bad-manners-kick-course-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-016 Bad Manners Kick Course (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BadMannersKickCourseReprint016);
  });
});
