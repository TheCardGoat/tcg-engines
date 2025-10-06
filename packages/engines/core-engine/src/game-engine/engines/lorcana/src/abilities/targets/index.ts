// Export all target types for easier imports

export * from "./card-target";
export * from "./player-target";
export * from "./targets";

// Legacy target exports for backward compatibility
export const self: any = { type: "card", owner: "self" };
export const thisCharacter: any = { type: "card", owner: "self" };
export const chosenCharacter: any = { type: "card" };
export const chosenOpposingCharacter: any = { type: "card", owner: "opponent" };
export const opposingCharacters: any = { type: "card", owner: "opponent" };
export const eachOpposingCharacter: any = { type: "card", owner: "opponent" };
export const allYourCharacters: any = { type: "card", owner: "self" };
export const oneOfYourOtherCharacters: any = { type: "card", owner: "self" };
export const targetCard: any = { type: "card" };
export const anotherChosenCharacterTarget: any = { type: "card" };
export const anotherChosenCharacter: any = { type: "card" };
export const itemsYouControl: any = {
  type: "card",
  cardType: "item",
  owner: "self",
};
export const anotherChosenCharOfYours: any = { type: "card", owner: "self" };
export const chosenOpposingDamagedCharacter: any = {
  type: "card",
  owner: "opponent",
};
export const yourOtherCharacters: any = { type: "card", owner: "self" };
export const chosenItemOfYours: any = {
  type: "card",
  cardType: "item",
  owner: "self",
};
export const chosenItem: any = { type: "card", cardType: "item" };
export const anyCard: any = { type: "card" };
export const namedCard: any = { type: "card" };
export const chosenCharacterOfYours: any = { type: "card", owner: "self" };
export const chosenCharacterOfYoursTarget: any = {
  type: "card",
  owner: "self",
};
export const allOpposingCharacters: any = { type: "card", owner: "opponent" };
export const yourBanishedItems: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  zone: "discard",
};
export const yourLocationCards: any = {
  type: "card",
  cardType: "location",
  owner: "self",
};
export const withCostXorLess: any = { type: "card" };
export const opponent: any = { type: "player", player: "opponent" };
export const allOtherCharactersHere: any = { type: "card", owner: "any" };
export const chosenItemOfYoursInHand: any = {
  type: "card",
  cardType: "item",
  owner: "self",
  zone: "hand",
};
export const chosenCharacterOfYoursIncludingSelf: any = {
  type: "card",
  owner: "self",
};
export const chosenLocation: any = { type: "card", cardType: "location" };
export const chosenCharacterNamed: any = { type: "card" };
export const chosenCharacterOfYoursAtLocation: any = {
  type: "card",
  owner: "self",
};
export const chosenOtherCharacterOfYours: any = { type: "card", owner: "self" };
export const chosenHeroCharacter: any = { type: "card" };
export const chosenCharacterOrLocationTarget: any = { type: "card" };
export const thisLocation: any = { type: "card", owner: "self" };
export const yourBanishedLocations: any = {
  type: "card",
  cardType: "location",
  owner: "self",
  zone: "discard",
};
export const targetCardsGains: any = { type: "card" };
