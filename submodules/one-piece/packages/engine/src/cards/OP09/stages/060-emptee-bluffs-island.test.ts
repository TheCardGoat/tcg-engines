import { describe, test } from "vite-plus/test";
import { op09EmpteeBluffsIsland060 } from "../../../../../cards/src/cards/stages/op09-060-emptee-bluffs-island.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-060 Emptee Bluffs Island", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09EmpteeBluffsIsland060);
  });
});
