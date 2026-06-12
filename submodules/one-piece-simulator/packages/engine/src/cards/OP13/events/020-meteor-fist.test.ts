import { describe, test } from "vite-plus/test";
import { op13MeteorFist020 } from "../../../../../cards/src/cards/OP13/events/020-meteor-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-020 Meteor Fist", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MeteorFist020);
  });
});
