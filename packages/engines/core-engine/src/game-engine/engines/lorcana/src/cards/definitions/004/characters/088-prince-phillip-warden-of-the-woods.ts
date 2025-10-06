import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipWardenOfTheWoods: LorcanaCharacterCardDefinition = {
  id: "xq2",
  reprints: ["l8f"],
  missingTestCase: true,
  name: "Prince Phillip",
  title: "Warden of the Woods",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**SHINING BEACON** Your other Hero characters gain **Ward**. _(Opponents can't chose them except to challenge.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Shining Beacon",
      text: "Your other Hero characters gain **Ward**. _(Opponents can't chose them except to challenge.)_",
      gainedAbility: wardAbility,
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["hero"] },
        ],
      },
    },
  ],
  flavour: "He stands ready to protect his friends from any threat.",
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Mike Parker",
  number: 88,
  set: "URR",
  rarity: "rare",
};
