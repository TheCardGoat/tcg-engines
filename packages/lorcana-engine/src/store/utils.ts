import {
  type Ability,
  bodyguardAbility,
  challengeReadyCharacters,
  challengerAbility,
  evasiveAbility,
  protectorAbility,
  recklessAbility,
  resistAbility,
  rushAbility,
  supportAbility,
  vanishAbility,
  voicelessAbility,
  wardAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  bodyguardAbilityPredicate,
  challengerAbilityPredicate,
  evasiveAbilityPredicate,
  metaAbilityPredicate,
  protectorAbilityPredicate,
  recklessAbilityPredicate,
  resistAbilityPredicate,
  rushAbilityPredicate,
  shiftAbilityPredicate,
  singerAbilityPredicate,
  singTogetherAbilityPredicate,
  supportAbilityPredicate,
  vanishAbilityPredicate,
  voicelessAbilityPredicate,
  wardAbilityPredicate,
} from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { exhaustiveCheck } from "@lorcanito/lorcana-engine/lib/exhaustiveCheck";
import type { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";

export const mapContinuousEffectToAbility = (
  element: ContinuousEffectModel,
): Ability | undefined => {
  const effect = element.effect.effect;

  if (effect.type !== "ability") {
    return undefined;
  }

  switch (effect.ability) {
    case "meta": {
      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "singer": {
      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "sing-together": {
      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "shift": {
      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "custom": {
      if ("customAbility" in effect) {
        return effect.customAbility;
      }

      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "challenger": {
      if ("amount" in effect && typeof effect.amount === "number") {
        const { amount } = effect;
        return challengerAbility(amount);
      }
      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "resist": {
      if ("amount" in effect && typeof effect.amount === "number") {
        const { amount } = effect;
        return resistAbility(amount);
      }

      console.error("Not implemented: ", effect.ability);
      break;
    }
    case "bodyguard": {
      return bodyguardAbility;
    }
    case "rush": {
      return rushAbility;
    }
    case "reckless": {
      return recklessAbility;
    }
    case "evasive": {
      return evasiveAbility;
    }
    case "support": {
      return supportAbility;
    }
    case "ward": {
      return wardAbility;
    }
    case "vanish": {
      return vanishAbility;
    }
    case "voiceless": {
      return voicelessAbility;
    }
    case "challenge_ready_chars": {
      return challengeReadyCharacters;
    }
    case "protector": {
      return protectorAbility;
    }
    default: {
      exhaustiveCheck(effect.ability);
    }
  }

  return undefined;
};

export const keywordToAbilityPredicate = (
  keyword: AbilityEffect["ability"],
): ((ability: Ability) => boolean) => {
  let predicate = (ability: Ability) => false;

  switch (keyword) {
    case "meta": {
      predicate = metaAbilityPredicate;
      break;
    }
    case "bodyguard": {
      predicate = bodyguardAbilityPredicate;
      break;
    }
    case "challenger": {
      predicate = challengerAbilityPredicate;
      break;
    }
    case "rush": {
      predicate = rushAbilityPredicate;
      break;
    }
    case "reckless": {
      predicate = recklessAbilityPredicate;
      break;
    }
    case "evasive": {
      predicate = evasiveAbilityPredicate;
      break;
    }
    case "support": {
      predicate = supportAbilityPredicate;
      break;
    }
    case "ward": {
      predicate = wardAbilityPredicate;
      break;
    }
    case "vanish": {
      predicate = vanishAbilityPredicate;
      break;
    }
    case "singer": {
      predicate = singerAbilityPredicate;
      break;
    }
    case "shift": {
      predicate = shiftAbilityPredicate;
      break;
    }
    case "voiceless": {
      predicate = voicelessAbilityPredicate;
      break;
    }
    case "resist": {
      predicate = resistAbilityPredicate;
      break;
    }
    case "protector": {
      predicate = protectorAbilityPredicate;
      break;
    }
    case "sing-together": {
      predicate = singTogetherAbilityPredicate;
      break;
    }
    case "challenge_ready_chars": {
      console.error("Not implemented: ", keyword);
      predicate = () => false;
      break;
    }
    case "custom": {
      console.error("Not implemented: ", keyword);
      predicate = () => false;
      break;
    }
    default: {
      exhaustiveCheck(keyword);
    }
  }

  return predicate;
};

export function normalizeToSafeASCII(str: string): string {
  return str.normalize("NFKD").replace(/[^\x00-\xFF]/g, "");
}

export function extraSafeJSONStringify(str: unknown): string {
  const string = typeof str === "string" ? str : JSON.stringify(str);
  return normalizeToSafeASCII(string);
}
