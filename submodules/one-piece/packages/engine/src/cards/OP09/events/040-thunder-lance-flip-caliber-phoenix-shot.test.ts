import { describe, test } from "vite-plus/test";
import { op09ThunderLanceFlipCaliberPhoenixShot040 } from "../../../../../cards/src/cards/OP09/events/040-thunder-lance-flip-caliber-phoenix-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-040 Thunder Lance Flip Caliber Phoenix Shot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ThunderLanceFlipCaliberPhoenixShot040);
  });
});
