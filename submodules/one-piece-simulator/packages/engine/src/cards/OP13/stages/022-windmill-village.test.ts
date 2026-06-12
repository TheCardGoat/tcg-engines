import { describe, test } from "vite-plus/test";
import { op13WindmillVillage022 } from "../../../../../cards/src/cards/OP13/stages/022-windmill-village.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-022 Windmill Village", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13WindmillVillage022);
  });
});
