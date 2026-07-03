import { describe, test } from "vite-plus/test";
import { op13PortgasDRouge014 } from "../../../../../cards/src/cards/OP13/characters/014-portgas-d-rouge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-014 Portgas.D.Rouge", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13PortgasDRouge014);
  });
});
