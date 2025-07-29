import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";

const chosenVillainOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["villain"] },
  ],
};

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const theMostDiabolicalScheme: LorcanitoActionCard = {
  id: "qad",

  name: "The Most Diabolical Scheme",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\nBanish chosen Villain of yours to banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "banish",
          target: chosenCharacter,
        },
        {
          type: "banish",
          target: chosenVillainOfYours,
        },
      ],
    },
  ],
  flavour: "New comes the real tour de force \nTricky and wicked, of course",
  colors: ["ruby"],
  cost: 3,
  illustrator: "Carlos Ruiz",
  number: 131,
  set: "ROF",
  rarity: "uncommon",
};
