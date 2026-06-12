import { describe, test } from "vite-plus/test";
import { op13GumGumElephantGun038 } from "../../../../../cards/src/cards/OP13/events/038-gum-gum-elephant-gun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-038 Gum-Gum Elephant Gun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumElephantGun038);
  });
});
