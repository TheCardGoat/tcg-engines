import { describe, test } from "vite-plus/test";
import { op02MeteorVolcano119 } from "../../../../../cards/src/cards/OP02/events/119-meteor-volcano.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-119 Meteor Volcano", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MeteorVolcano119);
  });
});
