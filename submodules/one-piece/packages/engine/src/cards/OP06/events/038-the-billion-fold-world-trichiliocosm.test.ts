import { describe, test } from "vite-plus/test";
import { op06TheBillionFoldWorldTrichiliocosm038 } from "../../../../../cards/src/cards/OP06/events/038-the-billion-fold-world-trichiliocosm.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-038 The Billion-fold World Trichiliocosm", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TheBillionFoldWorldTrichiliocosm038);
  });
});
