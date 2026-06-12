import { describe, test } from "vite-plus/test";
import { op12SlamGibson117 } from "../../../../../cards/src/cards/OP12/events/117-slam-gibson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-117 Slam Gibson", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12SlamGibson117);
  });
});
