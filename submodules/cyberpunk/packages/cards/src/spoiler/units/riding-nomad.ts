import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerRidingNomad = defineCyberpunkCard({
  id: "20bcc767-29f0-4aa0-b842-4d4e546ed36e",
  slug: "riding-nomad",
  rulesText: "This Unit can attack spent rival Units the turn it's played.",
  name: "Riding Nomad",
  displayName: "Riding Nomad",
  canonicalId: "riding-nomad",
  color: "green",
  classifications: ["Nomad"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "042",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/042.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 6,
  power: 6,
  abilities: [
    {
      kind: "static",
      text: "This Unit can attack spent rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "playedThisTurn",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
