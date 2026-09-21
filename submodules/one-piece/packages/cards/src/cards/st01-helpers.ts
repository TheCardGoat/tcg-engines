import type { OPCardI18n, OPRarity } from "@tcg/op-types";

function i18n(name: string, effect?: string, imageId?: string): OPCardI18n {
  return {
    en: {
      name,
      ...(effect ? { effect } : {}),
      ...(imageId
        ? { imageUrl: `https://www.optcgapi.com/media/static/Card_Images/${imageId}.jpg` }
        : {}),
    },
  };
}

function printing(id: string, rarity: OPRarity) {
  return {
    id,
    artId: id,
    setCode: "ST01",
    collectorNumber: id.slice("ST01-".length),
    rarity,
    imageUrl: `https://www.optcgapi.com/media/static/Card_Images/${id}.jpg`,
  };
}

const strawHat = ["Straw Hat Crew"];
const supernovasStrawHat = ["Supernovas", "Straw Hat Crew"];

export { i18n, printing, strawHat, supernovasStrawHat };
