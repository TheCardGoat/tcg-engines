import { describe, test } from "vite-plus/test";
import { op03FlameEmperor016 } from "../../../../../cards/src/cards/OP03/events/016-flame-emperor.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-016 Flame Emperor", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03FlameEmperor016);
  });
});
