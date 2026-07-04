import { describe, test } from "vite-plus/test";
import { op09EmpteeBluffsIsland060 } from "../../../../../cards/src/cards/OP09/stages/060-emptee-bluffs-island.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-060 Emptee Bluffs Island", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09EmpteeBluffsIsland060);
  });
});
