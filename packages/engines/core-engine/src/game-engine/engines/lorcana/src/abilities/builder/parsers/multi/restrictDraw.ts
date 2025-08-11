import { AbilityBuilder } from "../../ability-builder";

// Patterns like:
// "Chosen character can't challenge during their next turn. Draw a card."
// "Chosen opposing character can't quest during their next turn. Draw a card."
export function parseRestrictThenDraw(text: string) {
  const m = text.match(
    /^(Chosen (opposing )?character) can't (quest|challenge) during their next turn\. Draw a card\.?$/i,
  );
  if (!m) return null;

  const isOpposing = !!m[2];
  const restriction = m[3].toLowerCase() as "quest" | "challenge";

  const {
    restrictEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    DURING_THEIR_NEXT_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const {
    chosenCharacterTarget,
    chosenOpposingCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");

  const target = isOpposing
    ? chosenOpposingCharacterTarget
    : chosenCharacterTarget;

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setEffects([
      // Order keys to match fixture: type, restriction, duration, targets
      restrictEffect({
        restriction,
        duration: DURING_THEIR_NEXT_TURN,
        targets: [target],
      }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
