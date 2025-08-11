import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Banish chosen item. Its owner gains 2 lore."
// Build as a single ability with banish followedBy gain lore, no ability-level targets
export function parseBanishOwnerGainsLore(text: string) {
  if (!/^Banish chosen item\. Its owner gains (\d+) lore\.?$/i.test(text)) {
    return null;
  }

  const amount = Number.parseInt(
    text.match(/gains (\d+) lore/i)?.[1] || "1",
    10,
  );

  const {
    banishEffect,
    gainLoreEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenItemTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    targetOwnerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setEffects([
      banishEffect({
        targets: [chosenItemTarget],
        followedBy: gainLoreEffect({
          targets: [targetOwnerTarget],
          value: amount,
        }),
      }),
    ])
    .build();
}
