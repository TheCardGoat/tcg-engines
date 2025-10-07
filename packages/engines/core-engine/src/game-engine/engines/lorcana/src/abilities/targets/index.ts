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
export const chosenDamagedCharacterTarget: any = {
  type: "card",
  status: "damaged",
};

// More legacy target aliases
export const chosenCharacterOrLocation = chosenCharacterOrLocationTarget;
export const yourCharacters = allYourCharacters;

// Legacy aliases for target variations
export const chosenDamagedCharacter = chosenDamagedCharacterTarget;
export const anotherChosenCharacterOfYours = anotherChosenCharOfYours;
export const yourCharactersNamed = yourCharacters;
export const eachOfYourCharacters = yourCharacters;
export const allCharacters = allYourCharacters;
// Legacy aliases with corrected mappings
export const sourceCardTarget = self;
export const sourceTarget = self;
export const chosenExertedCharacterTarget: any = {
  type: "card",
  status: "exerted",
};
export const chosenYourExertedCharacter: any = {
  type: "card",
  status: "exerted",
  owner: "self",
};
export const anyNumberOfYourCharacters = allYourCharacters;
export const yourDamagedCharactersFilter: any = {
  type: "card",
  owner: "self",
  status: "damaged",
};
export const yourDamagedCharacters: any = {
  type: "card",
  owner: "self",
  status: "damaged",
};
export const chosenCharacterWithStrengthXorLess = chosenCharacter;
export const thisCard = self;
export const chosenItemOrLocation = chosenLocation;
export const eachOpposingReadyCharacter = eachOpposingCharacter;
export const chosenPirateCharacter: any = {
  type: "card",
  characteristics: ["pirate"],
};
export const yourOtherLocations: any = {
  type: "card",
  cardType: "location",
  owner: "self",
};

// Additional legacy targets
export const chosenCardFromYourHand: any = {
  type: "card",
  zone: "hand",
  owner: "self",
};
export const chosenPlayer: any = { type: "player" };
export const anyTarget: any = { type: "card" };
export const oneOfYourOpponentsCharactersItemsOrLocations: any = {
  type: "card",
  owner: "opponent",
};
export const anyCardTargetYouOwn: any = { type: "card", owner: "self" };
export const actionCardsInHand: any = {
  type: "card",
  cardType: "action",
  zone: "hand",
};
export const chosenCharacterCharacteristic: any = { type: "card" };
export const topCardOfYourDeck: any = {
  type: "card",
  zone: "deck",
  owner: "self",
};
export const yourFloodbornCharsThatHaveACardUnder: any = {
  type: "card",
  owner: "self",
};
export const eachCharacterInPlay: any = { type: "card", zone: "play" };
export const withStrengthXorMore: any = { type: "card" };
export const allYourCharacteristicCharacters: any = {
  type: "card",
  owner: "self",
};
export const allYourCharactersWithAnSpecificAbility: any = {
  type: "card",
  owner: "self",
};
export const parentsTarget: any = { type: "card" };
export const eachOtherCharacterInPlay: any = { type: "card", zone: "play" };
export const allOpposingItems: any = {
  type: "card",
  cardType: "item",
  owner: "opponent",
};
export const allOpposingLocations: any = {
  type: "card",
  cardType: "location",
  owner: "opponent",
};
