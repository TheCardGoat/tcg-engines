import { describe, test } from "vite-plus/test";
import { op02Hydra090 } from "../../../../../cards/src/cards/OP02/events/090-hydra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-090 Hydra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Hydra090);
  });
});
