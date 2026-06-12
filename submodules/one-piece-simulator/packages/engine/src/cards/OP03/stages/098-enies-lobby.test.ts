import { describe, test } from "vite-plus/test";
import { op03EniesLobby098 } from "../../../../../cards/src/cards/OP03/stages/098-enies-lobby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-098 Enies Lobby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03EniesLobby098);
  });
});
