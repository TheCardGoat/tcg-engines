import type { CharacterCard } from "@tcg/lorcana-types";
import { littleSisterResponsibleRabbitI18n } from "./163-little-sister-responsible-rabbit.i18n";

export const littleSisterResponsibleRabbit: CharacterCard = {
  id: "gBt",
  canonicalId: "ci_gBt",
  reprints: ["set8-163"],
  cardType: "character",
  name: "Little Sister",
  version: "Responsible Rabbit",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "008",
  cardNumber: 163,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fe47a07a0f14415284cb6ad8cbdd190e",
    tcgPlayer: 631460,
  },
  text: [
    {
      title: "LET ME HELP",
      description:
        "When you play this character, you may remove up to 1 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "g97-1",
      name: "LET ME HELP",
      text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: littleSisterResponsibleRabbitI18n,
};
