import { describe, test } from "vite-plus/test";
import { op02ParadiseTotsuka047 } from "../../../../../cards/src/cards/events/op02-047-paradise-totsuka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-047 Paradise Totsuka", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ParadiseTotsuka047);
  });
});
