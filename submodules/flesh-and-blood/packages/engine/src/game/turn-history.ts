/**
 * First-class per-player turn ledger. Every inventoried has-status / count
 * that is a "this turn" fact reads from here (or from combatChain / bindings).
 * Reset at end of turn via {@link emptyFabTurnHistory}.
 */
export type FabTurnSemanticObservation =
  | {
      readonly kind: "destroy";
      readonly canonicalId: string | null;
      readonly names: readonly string[];
      readonly supertypes: readonly string[];
      readonly sourceInstanceId: string | null;
    }
  | {
      readonly kind: "banish";
      readonly canonicalId: string | null;
      readonly names: readonly string[];
      readonly supertypes: readonly string[];
      readonly sourceInstanceId: string | null;
    };

export interface FabTurnHistory {
  turnNumber: number;
  crowdCheered: boolean;
  crowdBooed: boolean;
  boosted: boolean;
  fused: boolean;
  charged: boolean;
  pitchedPower6: boolean;
  /** True if a card with printed power ≥ 6 was discarded this turn (Brute gate). */
  discardedPower6: boolean;
  drewCard: boolean;
  cardsDrawn: number;
  /** Named hit-event outcomes; boolean/count queries are derived from this ledger. */
  hitOutcomes: {
    sourceObjectId: string;
    targetObjectId: string | null;
    sourceWasWeapon: boolean;
    sourceWasDagger: boolean;
    sourceWasSword: boolean;
    combatNumber: number | null;
  }[];
  /** Count of weapon attacks declared this turn (CR "attacked N times with weapons"). */
  weaponAttacks: number;
  /** Instance ids of weapons this player attacked with this turn (And Again / Hell Hammer). */
  weaponAttackInstanceIdsThisTurn: string[];
  /** Per-weapon declaration count; unlike the instance-id set, preserves repeated attacks. */
  weaponAttackCountsByInstanceIdThisTurn: Record<string, number>;
  /** Total attack declarations this turn, weapons and action attacks (CR "fourth time during a turn"). */
  attacksThisTurn: number;
  /** Number of attack declarations that targeted this hero this turn. */
  timesAttackedThisTurn: number;
  playedOrCreatedAura: boolean;
  playedInstant: boolean;
  banishedPower6: boolean;
  /** Accepted semantic events attributed to this player, before zone provenance is lost. */
  semanticObservations: FabTurnSemanticObservation[];
  instantEnteredGraveyard: boolean;
  beatenChest: boolean;
  cranked: boolean;
  /** The player usurped an opposing permanent this turn. */
  usurped: boolean;
  /** The player completed a contract this turn (CR 8.4.7 / 8.5.39a; DYN123 Pay Day gate). */
  completedAContract: boolean;
  /** Highest face this player rolled on a die this turn. */
  highestDieRoll: number;
  dealtDamage: boolean;
  damageDealtByType: Record<"arcane" | "physical" | "generic", number>;
  damageDealtBySource: Record<string, number>;
  damageDealtBySourceToHero: Record<string, number>;
  beenDealtDamage: boolean;
  damageTakenByType: Record<"arcane" | "physical" | "generic", number>;
  /** Per-source realized damage this player took this turn (HNT016 "dealt damage to you"). */
  damageTakenBySource: Record<string, number>;
  destroyedItem: boolean;
  pitchedBlue: boolean;
  lastAttackNames: readonly string[];
  attackedWithCrouchingTiger: boolean;
  transcended: boolean;
  attackFragmented: boolean;
  holoAuraEnteredThisTurn: boolean;
  heraldPutIntoSoulThisTurn: boolean;
  cardPutIntoSoulThisTurn: boolean;
  yellowCardPutIntoSoulThisTurn: boolean;
  consumedStaticReplacementIds: string[];
  blueCardsPlayed: number;
  redCardsPlayed: number;
  destroyedTokenNames: string[];
  /** An Aura this player controlled was destroyed this turn (Ominous family). */
  destroyedAuraThisTurn: boolean;
  createdSeismicSurge: boolean;
  controlledSeismicSurge: boolean;
  createdFealtyTokenThisTurn: boolean;
  /** A Crouching Tiger token was created this turn (MST163 Territorial Domain). */
  createdCrouchingTigerThisTurn: boolean;
  /** Clashes this player has won this turn (HVY Boast +X{d}). */
  clashesWonThisTurn: number;
  /** The player activated a Cannon this turn (Harpoon “if you've activated a cannon”). */
  activatedCannonThisTurn: boolean;
  /** The player activated a Weapon this turn (Templar Spellbane). */
  activatedWeaponThisTurn: boolean;
  /** An Illusionist AAC this player controlled was destroyed by phantasm this turn (Frightmare). */
  phantasmDestroyedIllusionistAttackActionThisTurn: boolean;
  /** Played a card or activated an ability this turn (Amulet of Ignition gate). */
  playedOrActivatedThisTurn: boolean;
  playedDraconicCardThisTurn: boolean;
  createdOrStolenGold: boolean;
  lifeGained: number;
  lostLife: boolean;
  createdOrActivatedGateToIArathael: boolean;
  runechantsCreated: number;
  bluePutIntoGraveyard: boolean;
  nonAttackActionsPlayed: number;
  attackActionsPlayed: number;
  playedCardNames: string[];
  playedFromBanished: boolean;
  weaponInstancesGainedGoAgain: string[];
  leftArena: {
    controllerId: string;
    names: readonly string[];
    metatypes: readonly string[];
    types: readonly string[];
  }[];
  /** CR 8.3.9: times the player paid the boost additional cost this turn. */
  boostsThisTurn: number;
  /** A card was banished as a boost cost this turn (CR 8.3.9a). */
  banishedFromBoostingThisTurn: boolean;
  /** An Evo was banished as a boost cost this turn. */
  evoBanishedFromBoostingThisTurn: boolean;
  /** CR 8.5.10a: intimidate effects this player generated this turn, including empty hands. */
  intimidatesThisTurn: number;
  /** Attacked or defended with an attack-action card this turn. */
  attackedOrDefendedWithAttackActionThisTurn: boolean;
  /** Printed supertypes of the last action card this player played this turn. */
  lastActionCardPlayedSupertypes: readonly string[];
  /** Ordered action-card plays this turn. "The last action card you played"
   * evaluated by a source that *is* the latest play reads the previous entry
   * (Current Funnel on-attack; CR the prior action, not the source itself). */
  actionCardPlaysThisTurn: readonly {
    readonly instanceId: string;
    readonly supertypes: readonly string[];
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
  }[];
  /** Activations this turn, typed for restrict play/activate caps (ARC043). */
  actionActivationsThisTurn: readonly {
    readonly instanceId: string;
    readonly abilityType: import("@tcg/flesh-and-blood-types").FabAbilityType;
    readonly supertypes: readonly string[];
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
  }[];
  /** Controlled a Toughness token at any point this turn. */
  controlledToughnessThisTurn: boolean;
  /** Controlled a Vigor token at any point this turn (including after it left). */
  controlledVigorThisTurn: boolean;
  /** Controlled a Might token at any point this turn (including after it left). */
  controlledMightThisTurn: boolean;
  /** Discarded a printed-power-6+ card as an additional cost this turn. */
  discardedPower6AsAdditionalCost: boolean;
  /** Highest printed power revealed this turn (Even Bigger Than That). */
  highestPowerRevealedThisTurn: number;
  /** Lightning / Earth / Ice fusion paid this turn (element-fused-this-turn). */
  fusedSupertypesThisTurn: readonly string[];
  /** Created a card (including a token) this turn. */
  createdCardThisTurn: boolean;
  /**
   * Colors this source instance has banished this turn (Bonds of Attraction
   * Errata Bulletin #9 — evaluate at each banish trigger, not after both).
   * Omitted when empty so snapshots stay compact.
   */
  banishedColorsBySourceThisTurn?: Readonly<Record<string, readonly string[]>>;
}

export function emptyFabTurnHistory(turnNumber: number): FabTurnHistory {
  return {
    turnNumber,
    crowdCheered: false,
    crowdBooed: false,
    boosted: false,
    fused: false,
    charged: false,
    pitchedPower6: false,
    discardedPower6: false,
    drewCard: false,
    cardsDrawn: 0,
    hitOutcomes: [],
    weaponAttacks: 0,
    weaponAttackInstanceIdsThisTurn: [],
    weaponAttackCountsByInstanceIdThisTurn: {},
    attacksThisTurn: 0,
    timesAttackedThisTurn: 0,
    playedOrCreatedAura: false,
    playedInstant: false,
    banishedPower6: false,
    semanticObservations: [],
    instantEnteredGraveyard: false,
    beatenChest: false,
    cranked: false,
    usurped: false,
    completedAContract: false,
    highestDieRoll: 0,
    dealtDamage: false,
    damageDealtByType: { arcane: 0, physical: 0, generic: 0 },
    damageDealtBySource: {},
    damageDealtBySourceToHero: {},
    beenDealtDamage: false,
    damageTakenByType: { arcane: 0, physical: 0, generic: 0 },
    damageTakenBySource: {},
    destroyedItem: false,
    pitchedBlue: false,
    lastAttackNames: [],
    attackedWithCrouchingTiger: false,
    transcended: false,
    attackFragmented: false,
    holoAuraEnteredThisTurn: false,
    heraldPutIntoSoulThisTurn: false,
    cardPutIntoSoulThisTurn: false,
    yellowCardPutIntoSoulThisTurn: false,
    consumedStaticReplacementIds: [],
    blueCardsPlayed: 0,
    redCardsPlayed: 0,
    destroyedTokenNames: [],
    destroyedAuraThisTurn: false,
    createdSeismicSurge: false,
    controlledSeismicSurge: false,
    createdFealtyTokenThisTurn: false,
    createdCrouchingTigerThisTurn: false,
    clashesWonThisTurn: 0,
    activatedCannonThisTurn: false,
    activatedWeaponThisTurn: false,
    phantasmDestroyedIllusionistAttackActionThisTurn: false,
    playedOrActivatedThisTurn: false,
    playedDraconicCardThisTurn: false,
    createdOrStolenGold: false,
    lifeGained: 0,
    lostLife: false,
    createdOrActivatedGateToIArathael: false,
    runechantsCreated: 0,
    bluePutIntoGraveyard: false,
    nonAttackActionsPlayed: 0,
    attackActionsPlayed: 0,
    playedCardNames: [],
    playedFromBanished: false,
    weaponInstancesGainedGoAgain: [],
    leftArena: [],
    boostsThisTurn: 0,
    banishedFromBoostingThisTurn: false,
    evoBanishedFromBoostingThisTurn: false,
    intimidatesThisTurn: 0,
    attackedOrDefendedWithAttackActionThisTurn: false,
    lastActionCardPlayedSupertypes: [],
    actionCardPlaysThisTurn: [],
    actionActivationsThisTurn: [],
    controlledToughnessThisTurn: false,
    controlledVigorThisTurn: false,
    controlledMightThisTurn: false,
    discardedPower6AsAdditionalCost: false,
    highestPowerRevealedThisTurn: 0,
    fusedSupertypesThisTurn: [],
    createdCardThisTurn: false,
  };
}
