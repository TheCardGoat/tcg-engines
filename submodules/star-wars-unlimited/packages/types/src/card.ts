import type { BaseCardDefinition } from "@tcg/card-model";

export type SwuAspect = "aggression" | "command" | "cunning" | "heroism" | "vigilance" | "villainy";

export type SwuArena = "ground" | "space";

export type SwuCardType = "base" | "event" | "leader" | "token" | "unit" | "upgrade";

export type SwuRarity = "common" | "uncommon" | "rare" | "legendary" | "special";

export type SwuSet =
  | "ASH"
  | "IBH"
  | "JTL"
  | "LAW"
  | "LOF"
  | "SEC"
  | "SHD"
  | "SOR"
  | "TS26"
  | "TWI"
  | (string & {});

export type SwuZone =
  | "base"
  | "capture"
  | "deck"
  | "discard"
  | "groundArena"
  | "hand"
  | "leader"
  | "outsideTheGame"
  | "resource"
  | "spaceArena";

export type SwuController = "any" | "friendly" | "opponent";

export type SwuKeyword =
  | "ambush"
  | "bounty"
  | "coordinate"
  | "exploit"
  | "grit"
  | "hidden"
  | "overwhelm"
  | "piloting"
  | "plot"
  | "raid"
  | "restore"
  | "saboteur"
  | "sentinel"
  | "shielded"
  | "smuggle"
  | "support";

export type SwuTrait = string;

export interface SwuSetCode {
  readonly set: SwuSet;
  readonly number?: number;
}

export interface SwuPrintedFace {
  readonly title: string;
  readonly subtitle?: string;
  readonly cost?: number;
  readonly hp?: number;
  readonly power?: number;
  readonly text?: string;
  readonly deployBox?: string;
  readonly epicAction?: string;
  readonly unique: boolean;
  readonly rules?: string;
  readonly aspects?: readonly SwuAspect[];
  readonly traits?: readonly SwuTrait[];
  readonly arena?: SwuArena;
  readonly keywords?: readonly SwuKeyword[];
}

export interface SwuCardMetadata extends SwuPrintedFace {
  readonly id: string;
  readonly internalName: string;
  readonly cardType: SwuCardType;
  readonly types: readonly SwuCardType[];
  readonly rarity?: SwuRarity;
  readonly backSideTitle?: string;
  readonly backSideAspects?: readonly SwuAspect[];
  readonly backSideTraits?: readonly SwuTrait[];
  readonly upgradeHp?: number;
  readonly upgradePower?: number;
  readonly pilotText?: string;
  readonly setId?: SwuSetCode;
  readonly setCodes?: readonly SwuSetCode[];
}

export interface SwuAbility {
  readonly kind: "action" | "constant" | "keyword" | "replacement" | "triggered";
  readonly text: string;
  readonly keyword?: SwuKeyword;
  readonly trigger?: SwuTrigger;
  readonly costs?: readonly SwuCost[];
  readonly conditions?: readonly SwuCondition[];
  readonly target?: SwuTarget;
  readonly effects?: readonly SwuEffect[];
  readonly optional?: boolean;
  readonly limit?: SwuAbilityLimit;
}

export type SwuAbilityLimit =
  | "oncePerGame"
  | "oncePerPhase"
  | "oncePerRound"
  | "oncePerTurn"
  | "whileInPlay";

export type SwuTrigger =
  | { readonly event: "action" }
  | { readonly event: "attack" }
  | { readonly event: "attackEnds" }
  | { readonly event: "attacked" }
  | { readonly event: "bounty" }
  | { readonly event: "defeated" }
  | { readonly event: "deployed" }
  | { readonly event: "epicAction" }
  | { readonly event: "played" }
  | { readonly event: "replacement" }
  | { readonly event: "when"; readonly name: string };

export type SwuCost =
  | { readonly type: "discard"; readonly amount: number; readonly target: SwuTarget }
  | { readonly type: "exhaust"; readonly target: SwuTarget }
  | { readonly type: "payResources"; readonly amount: number }
  | { readonly type: "resourceCard"; readonly target: SwuTarget }
  | { readonly type: "useForce"; readonly amount?: number };

export type SwuCondition =
  | { readonly type: "always" }
  | {
      readonly type: "attackDefender";
      readonly exhausted?: boolean;
      readonly playedThisPhase?: boolean;
    }
  | {
      readonly type: "cardsInHand";
      readonly controller: SwuController;
      readonly comparison: SwuComparison;
    }
  | {
      readonly type: "baseDamage";
      readonly controller: SwuController;
      readonly comparison: SwuComparison;
    }
  | {
      readonly type: "controlsAspect";
      readonly controller: SwuController;
      readonly aspect: SwuAspect;
      readonly excludeSelf?: boolean;
    }
  | {
      readonly type: "controlsTrait";
      readonly controller: SwuController;
      readonly trait: SwuTrait;
      readonly excludeSelf?: boolean;
      readonly comparison?: SwuComparison;
    }
  | {
      readonly type: "controlsMoreUnits";
      readonly controller: "friendly" | "opponent";
      readonly arena?: SwuArena;
    }
  | {
      readonly type: "hasInitiative";
      readonly controller: SwuController;
    }
  | { readonly type: "hasKeyword"; readonly target: SwuTarget; readonly keyword: SwuKeyword }
  | { readonly type: "hasTarget"; readonly target: SwuTarget }
  | {
      readonly type: "resources";
      readonly controller: SwuController;
      readonly comparison: SwuComparison;
    }
  | { readonly type: "sourceIsAttacking" }
  | { readonly type: "sourceIsDefending" }
  | { readonly type: "sourceIsDamaged" }
  | { readonly type: "sourceIsUpgraded" }
  | {
      readonly type: "unitsDefeatedThisPhase";
      readonly controller: SwuController;
      readonly comparison: SwuComparison;
    };

export interface SwuComparison {
  readonly operator: "eq" | "gt" | "gte" | "lt" | "lte";
  readonly value: number;
}

export type SwuTarget =
  | { readonly type: "attachedUnit" }
  | { readonly type: "base"; readonly controller?: SwuController }
  | {
      readonly type: "card";
      readonly controller?: SwuController;
      readonly zones?: readonly SwuZone[];
      readonly ids?: readonly string[];
      readonly cardTypes?: readonly SwuCardType[];
      readonly aspects?: readonly SwuAspect[];
      readonly arena?: SwuArena;
      readonly traits?: readonly SwuTrait[];
      readonly withoutTraits?: readonly SwuTrait[];
      readonly keywords?: readonly SwuKeyword[];
      readonly unique?: boolean;
      readonly exhausted?: boolean;
      readonly damaged?: boolean;
      readonly excludeSelf?: boolean;
      readonly cost?: SwuComparison;
      readonly power?: SwuComparison;
      readonly hp?: SwuComparison;
      readonly limit?: number;
    }
  | {
      readonly type: "choice";
      readonly id: string;
      readonly controller?: SwuController;
      readonly zones?: readonly SwuZone[];
      readonly ids?: readonly string[];
      readonly cardTypes?: readonly SwuCardType[];
      readonly traits?: readonly SwuTrait[];
      readonly keywords?: readonly SwuKeyword[];
    }
  | { readonly type: "player"; readonly controller?: SwuController }
  | { readonly type: "self" };

export type SwuEffect =
  | { readonly type: "attack"; readonly attacker?: SwuTarget; readonly defender?: SwuTarget }
  | { readonly type: "capture"; readonly target: SwuTarget }
  | { readonly type: "choose"; readonly choices: readonly SwuChoice[] }
  | { readonly type: "combatDamageFirst"; readonly target: SwuTarget }
  | {
      readonly type: "conditional";
      readonly condition: SwuCondition;
      readonly ifTrue: readonly SwuEffect[];
      readonly ifFalse?: readonly SwuEffect[];
    }
  | {
      readonly type: "createToken";
      readonly token:
        | "battleDroid"
        | "cloneTrooper"
        | "credit"
        | "force"
        | "mandalorian"
        | "shield"
        | "spy"
        | "tieFighter"
        | "xWing";
      readonly amount?: number;
      readonly target?: SwuTarget;
    }
  | {
      readonly type: "damage";
      readonly amount: number;
      readonly target: SwuTarget;
      readonly preventable?: boolean;
    }
  | {
      readonly type: "damageFrom";
      readonly source: SwuTarget;
      readonly target: SwuTarget;
      readonly amount: "damage" | "damagePlusOne" | "power";
      readonly preventable?: boolean;
    }
  | {
      readonly type: "damagePer";
      readonly target: SwuTarget;
      readonly per: "cardsInHand";
      readonly controller: SwuController;
      readonly multiplier?: number;
      readonly preventable?: boolean;
    }
  | {
      readonly type: "damagePer";
      readonly target: SwuTarget;
      readonly per: "targetCount";
      readonly count: SwuTarget;
      readonly multiplier?: number;
      readonly preventable?: boolean;
    }
  | { readonly type: "defeat"; readonly target: SwuTarget }
  | {
      readonly type: "delayed";
      readonly trigger: SwuTrigger;
      readonly effects: readonly SwuEffect[];
    }
  | { readonly type: "discard"; readonly target: SwuTarget; readonly amount?: number }
  | {
      readonly type: "distribute";
      readonly mode: "advantage" | "damage" | "experience" | "healing";
      readonly amount: number;
      readonly target: SwuTarget;
    }
  | { readonly type: "draw"; readonly controller: SwuController; readonly amount: number }
  | { readonly type: "exhaust"; readonly target: SwuTarget }
  | {
      readonly type: "gainKeyword";
      readonly target: SwuTarget;
      readonly keyword: SwuKeyword;
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "gainTrait";
      readonly target: SwuTarget;
      readonly trait: SwuTrait;
      readonly duration?: SwuEffectDuration;
    }
  | { readonly type: "heal"; readonly amount: number; readonly target: SwuTarget }
  | {
      readonly type: "ifYouDo";
      readonly doEffect: SwuEffect;
      readonly thenEffects: readonly SwuEffect[];
    }
  | {
      readonly type: "indirectDamage";
      readonly amount: number;
      readonly target: SwuTarget;
    }
  | {
      readonly type: "lasting";
      readonly duration: SwuEffectDuration;
      readonly effects: readonly SwuEffect[];
    }
  | { readonly type: "lookAt"; readonly target: SwuTarget }
  | {
      readonly type: "loseHealing";
      readonly target: SwuTarget;
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "loseKeyword";
      readonly target: SwuTarget;
      readonly keyword: SwuKeyword;
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "modifyStats";
      readonly target: SwuTarget;
      readonly power?: number;
      readonly hp?: number;
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "modifyStatsPer";
      readonly target: SwuTarget;
      readonly per: "damageOnTarget" | "friendlyResources";
      readonly power?: number;
      readonly hp?: number;
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "modifyStatsPer";
      readonly target: SwuTarget;
      readonly per: "targetCount";
      readonly count: SwuTarget;
      readonly power?: number;
      readonly hp?: number;
      readonly duration?: SwuEffectDuration;
    }
  | { readonly type: "move"; readonly target: SwuTarget; readonly to: SwuZone }
  | { readonly type: "optional"; readonly effects: readonly SwuEffect[] }
  | { readonly type: "payResources"; readonly amount: number }
  | { readonly type: "play"; readonly target: SwuTarget; readonly free?: boolean }
  | {
      readonly type: "preventDamage";
      readonly target: SwuTarget;
      readonly duration?: SwuEffectDuration;
    }
  | { readonly type: "ready"; readonly target: SwuTarget }
  | {
      readonly type: "replacement";
      readonly replaces: SwuTrigger;
      readonly effects: readonly SwuEffect[];
    }
  | {
      readonly type: "restrictAttack";
      readonly target: SwuTarget;
      readonly restriction: "cannotAttack" | "cannotAttackBases";
      readonly duration?: SwuEffectDuration;
    }
  | {
      readonly type: "reorder";
      readonly target: SwuTarget;
      readonly destination: "bottomOfDeck" | "topOfDeck";
      readonly order?: "any" | "random";
    }
  | { readonly type: "resource"; readonly target: SwuTarget; readonly ready?: boolean }
  | { readonly type: "reveal"; readonly target: SwuTarget }
  | {
      readonly type: "search";
      readonly target: SwuTarget;
      readonly destination: SwuZone;
      readonly reveal?: boolean;
    }
  | { readonly type: "sequential"; readonly effects: readonly SwuEffect[] }
  | { readonly type: "simultaneous"; readonly effects: readonly SwuEffect[] }
  | { readonly type: "takeControl"; readonly target: SwuTarget }
  | { readonly type: "useForce"; readonly amount?: number };

export type SwuEffectDuration = "attack" | "continuous" | "phase" | "round" | "turn";

export interface SwuChoice {
  readonly id: string;
  readonly label: string;
  readonly effects?: readonly SwuEffect[];
}

export interface SwuCardDefinition extends SwuCardMetadata, BaseCardDefinition {
  readonly abilities?: readonly SwuAbility[];
  /**
   * Inherited from {@link BaseCardDefinition}: `canonicalId`, `slug`, `name`,
   * `printings`, and optional `externalIds`.
   *
   * SWU seeds `canonicalId` and `slug` from {@link SwuCardMetadata.internalName}
   * (stable, ASCII, language-independent — see RFC §10 SWU step 2 / Open Q4).
   * `name` mirrors {@link SwuPrintedFace.title} for cross-game display.
   * `printings` is populated from the import tooling (set codes + merged
   * `variantOf` entries). `externalIds` is absent/empty initially (no upstream
   * vendor ids today).
   */
  readonly printings: BaseCardDefinition["printings"];
}

/**
 * Discriminated union of all generated card definitions.
 *
 * Use {@link SwuCardDefinition} when you need the wide, manually-authorable
 * shape (e.g. test fixtures); use {@link SwuCard} for cards that come from the
 * generated catalog, where every card is known to be one of the per-type
 * refinements.
 */
export type SwuCard =
  | SwuBaseCard
  | SwuEventCard
  | SwuLeaderCard
  | SwuTokenCard
  | SwuUnitCard
  | SwuUpgradeCard;

/**
 * Per-card-type refinements of {@link SwuCardDefinition}.
 *
 * These are based on the printed card anatomy and comprehensive rules sections
 * 3.2 (Base), 3.3 (Event), 3.4 (Leader), 3.5 (Unit), 3.6 (Upgrade), and 3.7
 * (Token). Properties that do not exist for a given type are marked as `never`
 * so generated card files cannot accidentally include them.
 */

export interface SwuBaseCard extends SwuCardDefinition {
  readonly cardType: "base";
  readonly types: readonly ["base", ...(readonly SwuCardType[])];
  readonly hp: number;
  readonly cost?: never;
  readonly power?: never;
  readonly arena?: never;
  readonly upgradePower?: never;
  readonly upgradeHp?: never;
  readonly deployBox?: never;
  readonly epicAction?: never;
}

export interface SwuEventCard extends SwuCardDefinition {
  readonly cardType: "event";
  readonly types: readonly ["event", ...(readonly SwuCardType[])];
  readonly cost: number;
  readonly hp?: never;
  readonly power?: never;
  readonly arena?: never;
  readonly upgradePower?: never;
  readonly upgradeHp?: never;
  readonly deployBox?: never;
  readonly epicAction?: never;
}

export interface SwuLeaderCard extends SwuCardDefinition {
  readonly cardType: "leader";
  readonly types: readonly ["leader", ...(readonly SwuCardType[])];
  readonly cost?: number;
  readonly hp?: number;
  readonly power?: number;
  readonly arena?: SwuArena;
}

export interface SwuUnitCard extends SwuCardDefinition {
  readonly cardType: "unit";
  readonly types: readonly ["unit", ...(readonly SwuCardType[])];
  readonly cost: number;
  readonly hp: number;
  readonly power: number;
  readonly arena: SwuArena;
  readonly deployBox?: never;
}

export interface SwuUpgradeCard extends SwuCardDefinition {
  readonly cardType: "upgrade";
  readonly types: readonly ["upgrade", ...(readonly SwuCardType[])];
  readonly cost: number;
  readonly upgradePower: number;
  readonly upgradeHp: number;
  readonly hp?: never;
  readonly power?: never;
  readonly arena?: never;
  readonly deployBox?: never;
  readonly epicAction?: never;
}

export interface SwuTokenCard extends SwuCardDefinition {
  readonly cardType: "token";
  readonly types: readonly ["token", ...(readonly SwuCardType[])];
}

export interface SwuCardMapEntry {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly internalName: string;
  readonly cost?: number;
  readonly rarity?: SwuRarity;
}

export interface SwuCardCatalog {
  readonly cards: readonly SwuCard[];
  readonly cardMap: readonly SwuCardMapEntry[];
  readonly allNonLeaderCardTitles: readonly string[];
  readonly playableCardTitles: readonly string[];
  readonly setCodeMap: Readonly<Record<string, string>>;
  readonly leaderNames: readonly {
    readonly name: string;
    readonly id: string;
    readonly subtitle?: string | null;
  }[];
}
