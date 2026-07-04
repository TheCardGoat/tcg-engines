import { describe, test } from "vite-plus/test";
import { op04OimoKashii078 } from "../../../../../cards/src/cards/OP04/characters/078-oimo-kashii.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-078 Oimo & Kashii", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04OimoKashii078);
  });
});
