import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import { wheneverYouPlayAnActionNotASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

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

export const johnSilverVengefulPirate: LorcanaCharacterCardDefinition = {
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
