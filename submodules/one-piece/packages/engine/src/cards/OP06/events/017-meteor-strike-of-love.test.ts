import { describe, test } from "vite-plus/test";
import { op06MeteorStrikeOfLove017 } from "../../../../../cards/src/cards/OP06/events/017-meteor-strike-of-love.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-017 Meteor-Strike of Love", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06MeteorStrikeOfLove017);
  });
});
