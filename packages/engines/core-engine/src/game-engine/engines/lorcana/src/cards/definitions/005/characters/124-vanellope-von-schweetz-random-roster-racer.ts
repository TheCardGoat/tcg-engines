import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vanellopeVonSchweetzRandomRosterRacer: LorcanitoCharacterCardDefinition =
  {
    id: "zv7",
    name: "Vanellope von Schweetz",
    title: "Random Roster Racer",
    characteristics: ["hero", "storyborn", "princess", "racer"],
    text: "**Rush** _(This character can challenge the turn they’re played.)_ **PIXLEXIA** When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_",
    type: "character",
    abilities: [
      rushAbility,
      {
        type: "resolution",
        name: "PIXLEXIA",
        text: "When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_",
        effects: [
          {
            type: "ability",
            ability: "evasive",
            modifier: "add",
            duration: "next_turn",
            until: true,
            target: thisCharacter,
          },
        ],
      },
    ],
    colors: ["ruby"],
    cost: 4,
    strength: 3,
    willpower: 3,
    lore: 2,
    illustrator: "Hyuna Lee",
    number: 124,
    set: "SSK",
    rarity: "rare",
  };
