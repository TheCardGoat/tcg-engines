import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { whenYouPlayThisForEachYouPayLess } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sheriffOfNottinghamBushelBritches: LorcanaCharacterCardDefinition =
  {
    id: "e7d",
    name: "Sheriff of Nottingham",
    title: "Bushel Britches",
    characteristics: ["storyborn", "villain"],
    text: "**EVERY LITTLE BIT HELPS** For each item you have in play, you pay 1 {I} less to play this character. **Support** _(Whenever this character quests, you may add their to another chosen character’s this turn.)_",
    type: "character",
    abilities: [
      supportAbility,
      whenYouPlayThisForEachYouPayLess({
        name: "EVERY LITTLE BIT HELPS",
        text: "For each item you have in play, you pay 1 {I} less to play this character.",
        amount: {
          dynamic: true,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "item" },
            { filter: "zone", value: "play" },
          ],
        },
      }),
    ],
    colors: ["sapphire"],
    cost: 9,
    strength: 5,
    willpower: 9,
    lore: 4,
    illustrator: "Josep Solé",
    number: 145,
    set: "SSK",
    rarity: "rare",
  };
