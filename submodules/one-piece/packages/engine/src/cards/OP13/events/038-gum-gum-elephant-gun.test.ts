import { describe, test } from "vite-plus/test";
import { op13GumGumElephantGun038 } from "../../../../../cards/src/cards/events/op13-038-gum-gum-elephant-gun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-038 Gum-Gum Elephant Gun", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GumGumElephantGun038);
  });
});
