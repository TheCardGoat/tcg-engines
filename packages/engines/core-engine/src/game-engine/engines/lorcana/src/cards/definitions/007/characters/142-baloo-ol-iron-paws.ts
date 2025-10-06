import { damageDealtRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { StaticAbilityWithEffect } from "~/game-engine/engines/lorcana/src/abilities";
import { withStrengthXorMore } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { targetCardsGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const name = "FIGHT LIKE A BEAR";
const text = "Your characters with 7 {S} or more can't be dealt damage.";

const cantBeDealtDamage: StaticAbilityWithEffect = {
  type: "static",
  ability: "effects",
  name: name,
  text: text,
  effects: [damageDealtRestrictionEffect],
};

const yourCharactersWith7StrOrMore: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    withStrengthXorMore(7),
  ],
};

export const balooOlIronPaws: LorcanaCharacterCardDefinition = {
  id: "cpi",
  name: "Baloo",
  title: "Ol' Iron Paws",
  characteristics: ["storyborn", "ally"],
  text: "FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.",
  type: "character",
  inkwell: false,
  colors: ["ruby"],
  cost: 6,
  strength: 5,
  willpower: 4,
  illustrator: "Sergio Mancini",
  number: 142,
  set: "007",
  rarity: "legendary",
  lore: 2,
  abilities: [
    targetCardsGains({
      name: name,
      text: text,
      target: yourCharactersWith7StrOrMore,
      ability: cantBeDealtDamage,
    }),
  ],
};
