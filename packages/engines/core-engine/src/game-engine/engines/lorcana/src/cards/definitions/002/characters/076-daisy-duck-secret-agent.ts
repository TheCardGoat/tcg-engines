import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckSecretAgent: LorcanaCharacterCardDefinition = {
  id: "vqt",
  reprints: ["pqa"],

  name: "Daisy Duck",
  title: "Secret Agent",
  characteristics: ["dreamborn", "ally"],
  text: "**THWART** Whenever this character quests, each opponent chooses and discards a card.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Thwart",
      text: "Whenever this character quests, each opponent chooses and discards a card.",
      optional: false,
      responder: "opponent",
      effects: [discardACard],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Lissette Carrera",
  number: 76,
  set: "ROF",
  rarity: "uncommon",
};
