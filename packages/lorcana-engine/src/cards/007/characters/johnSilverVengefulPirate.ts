import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverYouPlayAnActionNotASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";

const drawnToAFight = whenYouPlayThisForEachYouPayLess({
  name: "Drawn to a Fight",
  text: "If an opposing character was damaged this turn, you pay 2 {I} less to play this character.",
  conditions: [
    {
      type: "this-turn",
      value: "was-damaged",
      target: "self",
      comparison: { operator: "gte", value: 1 },
      filters: [
        { filter: "type", value: "character" },
        { filter: "owner", value: "opponent" },
      ],
    },
  ],
  amount: 2,
});

const iAintGoneSoft = wheneverYouPlayAnActionNotASong({
  name: "I Ain't Gone Soft",
  text: "Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
  optional: true,
  effects: [dealDamageEffect(1, chosenCharacter)],
});

export const johnSilverVengefulPirate: LorcanitoCharacterCard = {
  id: "ox6",
  name: "John Silver",
  title: "Vengeful Pirate",
  characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
  text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
  type: "character",
  abilities: [drawnToAFight, resistAbility(1), iAintGoneSoft],
  inkwell: true,
  colors: ["emerald"],
  cost: 8,
  strength: 6,
  willpower: 4,
  illustrator: "Nicholas Kole",
  number: 109,
  set: "007",
  rarity: "rare",
  lore: 2,
};
