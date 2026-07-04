import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckShadowySuperheroI18n } from "./187-darkwing-duck-shadowy-superhero.i18n";

export const darkwingDuckShadowySuperhero: CharacterCard = {
  id: "dn0",
  canonicalId: "ci_dn0",
  slug: "lorcana-ci_dn0",
  printings: [
    {
      id: "set13-187",
      artId: "set13-187",
      setCode: "set13",
      collectorNumber: "187",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-187"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Shadowy Superhero",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 187,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f4a78d79c003420c839e09c533d7a381",
  },
  text: [
    {
      title: "PREEMPTIVE STRIKE",
      description: "When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Detective"],
  abilities: [
    {
      type: "triggered",
      name: "PREEMPTIVE STRIKE",
      text: "PREEMPTIVE STRIKE When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    },
  ],
  i18n: darkwingDuckShadowySuperheroI18n,
};
