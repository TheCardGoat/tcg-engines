import { describe, test } from "vite-plus/test";
import { op05DragonClaw095 } from "../../../../../cards/src/cards/events/op05-095-dragon-claw.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-095 Dragon Claw", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DragonClaw095);
  });
});
