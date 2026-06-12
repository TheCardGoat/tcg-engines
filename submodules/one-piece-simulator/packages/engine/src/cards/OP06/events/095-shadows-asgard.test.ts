import { describe, test } from "vite-plus/test";
import { op06ShadowsAsgard095 } from "../../../../../cards/src/cards/OP06/events/095-shadows-asgard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-095 Shadows Asgard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ShadowsAsgard095);
  });
});
