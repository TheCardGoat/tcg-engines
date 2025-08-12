import { AbilityBuilder } from "../../ability-builder";

// Ready all your characters. They can't quest for the rest of this turn.
export function parseReadyAllThenRestrict(text: string) {
  if (
    !/^Ready all your characters\. They can't quest for the rest of this turn\.?$/i.test(
      text,
    )
  )
    return null;
  const {
    yourCharactersTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    restrictEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    FOR_THE_REST_OF_THIS_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setTargets([yourCharactersTarget])
    .setEffects([
      { type: "ready", targets: [yourCharactersTarget] },
      restrictEffect({
        targets: [yourCharactersTarget],
        restriction: "quest",
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
    ])
    .build();
}
