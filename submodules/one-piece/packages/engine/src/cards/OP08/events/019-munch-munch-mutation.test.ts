import { describe, test } from "vite-plus/test";
import { op08MunchMunchMutation019 } from "../../../../../cards/src/cards/OP08/events/019-munch-munch-mutation.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-019 Munch-Munch Mutation", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MunchMunchMutation019);
  });
});
