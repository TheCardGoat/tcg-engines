import { AbilityBuilder } from "../../ability-builder";

export function parseGrant(text: string) {
  // Markdown ability granting with optional value and "this turn"
  const abilityGrantMatch = text.match(
    /^Chosen character gains \*\*([A-Za-z]+)\*\*(?: \+(\d+))? this turn\.?$/i,
  );
  if (abilityGrantMatch) {
    const abilityName = abilityGrantMatch[1].toLowerCase();
    const abilityValue = abilityGrantMatch[2]
      ? Number.parseInt(abilityGrantMatch[2], 10)
      : null;

    const {
      gainsAbilityEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");

    let ability;
    if (abilityName === "rush") {
      const {
        rushAbility,
      } = require("~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility");
      ability = rushAbility;
    } else if (abilityName === "challenger" && abilityValue !== null) {
      const {
        challengerAbility,
      } = require("~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility");
      ability = challengerAbility(abilityValue);
    } else {
      return null;
    }

    const duration = abilityName === "rush" ? undefined : THIS_TURN;
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        gainsAbilityEffect({
          ability,
          duration,
        }),
      ]);
  }

  // Combined grant: Resist +1 and Evasive this turn
  if (
    /^Chosen character gains \*\*Resist\*\* \+(\d+) and \*\*Evasive\*\* this turn\.?$/i.test(
      text,
    )
  ) {
    const amount = Number.parseInt(text.match(/\+(\d+)/)![1], 10);
    const {
      gainsAbilityEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const {
      resistAbility,
    } = require("~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility");
    const {
      evasiveAbility,
    } = require("~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility");

    const normalized = text
      .replace(/\*\*Resist\*\*/g, "Resist")
      .replace(/\*\*Evasive\*\*/g, "Evasive");
    const normalizedText = normalized.endsWith(".")
      ? normalized
      : normalized + ".";

    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        gainsAbilityEffect({
          ability: resistAbility(amount),
          duration: THIS_TURN,
        }),
        gainsAbilityEffect({ ability: evasiveAbility, duration: THIS_TURN }),
      ]);
  }

  // Markdown ability granting "until the start of your next turn"
  const abilityGrantUntilMatch = text.match(
    /^Chosen character gains \*\*([A-Za-z]+)\*\* until the start of your next turn\.?$/i,
  );
  if (abilityGrantUntilMatch) {
    const abilityName = abilityGrantUntilMatch[1].toLowerCase();
    const {
      gainsAbilityEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      UNTIL_START_OF_YOUR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");

    const abilityMap: Record<string, any> = {
      evasive:
        require("~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility")
          .evasiveAbility,
    };
    const ability = abilityMap[abilityName];
    if (!ability) return null;

    // Remove ** markdown in the text for this pattern
    let normalizedText = text.replace(/\*\*([A-Za-z]+)\*\*/g, "$1");
    if (!normalizedText.endsWith(".")) normalizedText += ".";

    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        gainsAbilityEffect({
          ability,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ]);
  }

  // Non-markdown ability granting until next turn (e.g., Bodyguard)
  const abilityGrantNonMarkdownMatch = text.match(
    /^Chosen character gains ([A-Za-z]+) until the start of your next turn\.?$/i,
  );
  if (abilityGrantNonMarkdownMatch) {
    const abilityName = abilityGrantNonMarkdownMatch[1].toLowerCase();
    const {
      gainsAbilityEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      UNTIL_START_OF_YOUR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");

    let ability;
    if (abilityName === "bodyguard") {
      const {
        bodyguardAbility,
      } = require("~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility");
      ability = bodyguardAbility;
    } else if (abilityName === "evasive") {
      const {
        evasiveAbility,
      } = require("~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility");
      ability = evasiveAbility;
    } else {
      return null;
    }

    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        gainsAbilityEffect({
          ability,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ]);
  }

  return null;
}
