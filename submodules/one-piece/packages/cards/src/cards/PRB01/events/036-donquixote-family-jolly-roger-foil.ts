import type { EventCard } from "@tcg/op-types";
import { op04DonquixoteFamily036 } from "../../OP04/events/036-donquixote-family.ts";
import { prb01DonquixoteFamilyJollyRogerFoil036I18n } from "./036-donquixote-family-jolly-roger-foil.i18n.ts";

export const prb01DonquixoteFamilyJollyRogerFoil036: EventCard = {
  ...op04DonquixoteFamily036,
  id: "OP04-036_p2",
  slug: "donquixote-family-jolly-roger-foil",
  name: "Donquixote Family (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-036_p2",
      artId: "OP04-036_p2",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p2.jpg",
    },
    {
      id: "OP04-036_p3",
      artId: "OP04-036_p3",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p3.jpg",
    },
    {
      id: "OP04-036_r1",
      artId: "OP04-036_r1",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p3.jpg",
      imageId: "OP04-036_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_r1.png",
      imageId: "OP04-036_r1",
    },
  ],
  i18n: prb01DonquixoteFamilyJollyRogerFoil036I18n,
};
