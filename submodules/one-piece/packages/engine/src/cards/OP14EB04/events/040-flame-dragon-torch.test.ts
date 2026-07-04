import { describe, test } from "vite-plus/test";
import { op14eb04FlameDragonTorch040 } from "../../../../../cards/src/cards/OP14EB04/events/040-flame-dragon-torch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-040 Flame Dragon Torch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04FlameDragonTorch040);
  });
});
