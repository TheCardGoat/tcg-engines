import { describe, test } from "vite-plus/test";
import { op02DiableJambeVenaisonShoot046 } from "../../../../../cards/src/cards/OP02/events/046-diable-jambe-venaison-shoot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-046 Diable Jambe Venaison Shoot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DiableJambeVenaisonShoot046);
  });
});
