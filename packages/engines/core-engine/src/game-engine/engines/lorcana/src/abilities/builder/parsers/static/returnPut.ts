import { AbilityBuilder } from "../../ability-builder";

export function parseReturnPut(text: string) {
  // Return chosen character to their player's hand.
  if (/^Return chosen character to their player's hand\.?$/i.test(text)) {
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    return AbilityBuilder.static(
      "Return chosen character to their player's hand.",
    )
      .setTargets([chosenCharacterTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "play" })]);
  }

  return null;
}
