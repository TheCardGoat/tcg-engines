import { describe, test } from "vite-plus/test";
import { op02ThreeSwordStyleOniGiri045 } from "../../../../../cards/src/cards/OP02/events/045-three-sword-style-oni-giri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-045 Three Sword Style Oni Giri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ThreeSwordStyleOniGiri045);
  });
});
