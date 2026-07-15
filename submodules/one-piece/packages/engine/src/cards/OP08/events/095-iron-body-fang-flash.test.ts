import { describe, test } from "vite-plus/test";
import { op08IronBodyFangFlash095 } from "../../../../../cards/src/cards/OP08/events/095-iron-body-fang-flash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-095 Iron Body Fang Flash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08IronBodyFangFlash095);
  });
});
