import { describe, test } from "vite-plus/test";
import { op02ParadiseTotsuka047 } from "../../../../../cards/src/cards/OP02/events/047-paradise-totsuka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-047 Paradise Totsuka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ParadiseTotsuka047);
  });
});
