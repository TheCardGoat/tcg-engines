import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseGiantMouse: LorcanaCharacterCardDefinition = {
  id: "vyt",
  name: "Mickey Mouse",
  title: "Giant Mouse",
  characteristics: ["dreamborn", "hero"],
  text: "Bodyguard\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenThisCharacterBanished({
      name: "THE BIGGEST STAR EVER",
      text: "When this character is banished, deal 5 damage to each opposing character.",
      effects: [
        dealDamageEffect(5, {
          type: "card",
          value: "all",
          filters: [
            {
              filter: "owner",
              value: "opponent",
            },
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
          ],
        }),
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 10,
  strength: 10,
  willpower: 10,
  illustrator: "Joy Ang / Giulia Riva",
  number: 199,
  set: "008",
  rarity: "legendary",
  lore: 5,
};
