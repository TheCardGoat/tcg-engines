import { describe, test } from "vite-plus/test";
import { op02NewKamaLand070 } from "../../../../../cards/src/cards/OP02/stages/070-new-kama-land.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-070 New Kama Land", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02NewKamaLand070);
  });
});
