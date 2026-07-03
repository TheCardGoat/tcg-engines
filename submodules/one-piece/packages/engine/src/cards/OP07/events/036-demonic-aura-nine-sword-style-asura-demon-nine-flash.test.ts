import { describe, test } from "vite-plus/test";
import { op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036 } from "../../../../../cards/src/cards/OP07/events/036-demonic-aura-nine-sword-style-asura-demon-nine-flash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-036 Demonic Aura Nine-Sword Style Asura Demon Nine Flash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DemonicAuraNineSwordStyleAsuraDemonNineFlash036);
  });
});
