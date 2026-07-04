import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaSatoriSwordOfSaburo = defineCyberpunkCard({
  id: "07be92a9-d9c9-43f6-a497-4c0aa20c46d1",
  slug: "satori-sword-of-saburo",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK If this unit wins a fight against a rival unit, draw a card.",
  subname: "Sword of Saburo",
  name: "Satori",
  displayName: "Satori - Sword of Saburo",
  canonicalId: "satori-sword-of-saburo",
  color: "red",
  classifications: ["Weapon", "Arasaka"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α020",
  artist: "Ivan Shavrin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a020.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "gear",
  cost: 2,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("If this unit wins a fight against a rival unit, draw a card.")
      .onFightResolved({
        player: "friendly",
        result: "attackerWins",
        attacker: target.host(),
        defender: target.card({ cardTypes: ["unit"] }),
      })
      .source(target.host())
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
        }),
      )
      .build(),
  ],
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
