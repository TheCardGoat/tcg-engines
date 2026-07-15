import { adjectives, type Config, uniqueNamesGenerator } from "unique-names-generator";
import { lorcanaNames, lorcanaTitles } from "./name-dictionary";

function capitalizeEveryFirstLetter(word = "") {
  try {
    const words = word.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }

    return words.join(" ");
  } catch (e) {
    return word;
  }
}

function normalizeToSafeASCII(str: string): string {
  return str.normalize("NFKD").replace(/[^\p{ASCII}]/gu, "");
}

const offensiveAdjectives = ["gay", "sexual"];
export const filteredAdjectives = adjectives.filter(
  (word) => !offensiveAdjectives.includes(word.toLowerCase()),
);

export function generateRandomName(): string {
  const customConfig: Config = {
    dictionaries: [filteredAdjectives, lorcanaNames, lorcanaTitles],
    separator: " ",
    length: 3,
    style: "capital",
  };

  return normalizeToSafeASCII(capitalizeEveryFirstLetter(uniqueNamesGenerator(customConfig)));
}

export function generateUserName(seed?: string): string {
  const customConfig: Config = {
    dictionaries: [lorcanaNames, lorcanaTitles],
    separator: " ",
    length: 2,
    style: "capital",
    ...(seed != null && { seed }),
  };

  return normalizeToSafeASCII(capitalizeEveryFirstLetter(uniqueNamesGenerator(customConfig)));
}

export function generateDeckName(): string {
  const customConfig: Config = {
    dictionaries: [filteredAdjectives, lorcanaNames],
    separator: " ",
    length: 2,
    style: "capital",
  };

  return normalizeToSafeASCII(capitalizeEveryFirstLetter(uniqueNamesGenerator(customConfig)));
}
