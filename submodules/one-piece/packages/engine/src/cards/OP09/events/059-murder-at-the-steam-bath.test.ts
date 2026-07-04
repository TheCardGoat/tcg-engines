import { describe, test } from "vite-plus/test";
import { op09MurderAtTheSteamBath059 } from "../../../../../cards/src/cards/OP09/events/059-murder-at-the-steam-bath.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-059 Murder at the Steam Bath", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MurderAtTheSteamBath059);
  });
});
