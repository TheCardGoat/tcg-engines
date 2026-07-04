import { describe, test } from "vite-plus/test";
import { op03Arlong022 } from "../../../../../cards/src/cards/OP03/leaders/022-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-022 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Arlong022);
  });
});
