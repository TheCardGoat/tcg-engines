// Legacy type definitions for migration from @lorcanito/lorcana-engine
// These are temporary stubs to allow old card definitions to type-check

declare module "@lorcanito/lorcana-engine" {
  export type LorcanitoCharacterCard = any;
  export type LorcanitoItemCard = any;
  export type LorcanaCharacterCardDefinition = any;
  export type LorcanitoCardDefinition = any;
  export type PlayEffect = any;
  export type AbilityEffect = any;
  export type ActivatedAbility = any;
  export type ResolutionAbility = any;
  export type StaticAbility = any;
  export type WheneverAbility = any;
  export type CardEffectTarget = any;
  export type TargetFilter = any;
  export type GainAbilityStaticAbility = any;
  export type AttributeEffect = any;
  export type BanishEffect = any;
  export type ScryEffect = any;
  export type ExertEffect = any;
  export type HealEffect = any;
  export const allCardsById: any;
}

declare module "@lorcanito/lorcana-engine/effects/effectTypes" {
  export type DealDamageEffect = any;
  export type DrawEffect = any;
  export type BanishEffect = any;
  export type GetEffect = any;
  export type CreateLayerTargetingPlayer = any;
  export type CreateLayerBasedOnTarget = any;
  export type RevealTopCardEffect = any;
}

declare module "@lorcanito/lorcana-engine/effects/effectTargets" {
  export const chosenCharacter: any;
  export const allCharacters: any;
  export const self: any;
  export type CardEffectTarget = any;
}

declare module "@lorcanito/lorcana-engine/__mocks__/createGameMock" {
  export const createGameMock: any;
}

declare module "@lorcanito/lorcana-engine/store/resolvers/conditionResolver" {
  export const conditionResolver: any;
}
