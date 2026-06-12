import { describe, test } from "vite-plus/test";
import { op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037 } from "../../../../../cards/src/cards/OP12/events/037-demon-aura-nine-sword-style-asura-blades-drawn-dead-man-s-game.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-037 Demon Aura Nine Sword Style Asura Blades Drawn Dead Man's Game", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037);
  });
});
