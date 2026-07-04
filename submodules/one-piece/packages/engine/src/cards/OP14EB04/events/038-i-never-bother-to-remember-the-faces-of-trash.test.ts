import { describe, test } from "vite-plus/test";
import { op14eb04INeverBotherToRememberTheFacesOfTrash038 } from "../../../../../cards/src/cards/OP14EB04/events/038-i-never-bother-to-remember-the-faces-of-trash.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-038 I Never Bother to Remember the Faces of Trash", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04INeverBotherToRememberTheFacesOfTrash038);
  });
});
