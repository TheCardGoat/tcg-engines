import { describe, test } from "vite-plus/test";
import { op02MeteorVolcano119 } from "../../../../../cards/src/cards/events/op02-119-meteor-volcano.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-119 Meteor Volcano", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MeteorVolcano119);
  });
});
