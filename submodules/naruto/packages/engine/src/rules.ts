/**
 * Versioned rules profile for the unreleased Naruto Card Game.
 *
 * The official site is still explicitly under development.  This profile
 * records the small structural subset it currently confirms and deliberately
 * labels every other runtime decision as provisional.  Consumers must show
 * the profile id/version with a saved game or runtime fingerprint rather than
 * representing this engine as an official rules implementation.
 */

export interface RuleSourceReference {
  readonly url: string;
  readonly accessedOn: string;
  /** SHA-256 of normalized text from the reviewed #type and #feature sections. */
  readonly reviewedContentSha256: string;
  readonly scope: string;
  /** Repository-relative structured evidence mapping for each confirmed field. */
  readonly evidenceManifest: string;
}

/** Facts stated by the official welcome page as of the access date below. */
export interface ConfirmedStructuralRules {
  /** Literal "deck of 51 cards" statement; its composition is not yet published. */
  readonly totalDeckSize: number;
  readonly chakraCount: number;
  readonly summonCount: number;
  readonly cardTypes: readonly ["leader", "character", "ex_character", "chakra", "summon"];
  /** The page says Character cards are chosen based on the Leader's color. */
  readonly charactersChosenByLeaderColor: true;
  readonly exCharactersRequireConditions: true;
  readonly summonRestsToDeploy: true;
  readonly chakraActivatesFaceDownSupports: true;
  readonly leaderLifeZeroLoses: true;
}

/**
 * Play decisions not yet confirmed by a published comprehensive rulebook.
 * These values are part of the Preview profile, not claims about final rules.
 */
export interface ProvisionalRules {
  /**
   * Preview main-deck size when `DeckList.leaderId` is stored separately.
   * The welcome page does not state that its 51-card deck includes the Leader,
   * so the 50-card relationship is an implementation choice, not a confirmed
   * construction rule.
   */
  readonly mainDeckSize: number;
  readonly openingHand: number;
  /** Only the second player gets a mulligan window. */
  readonly mulliganForSecondPlayer: boolean;
  readonly firstTurnDraw: number;
  readonly normalDraw: number;
  /** No attacks while turn <= 2. */
  readonly noAttackOnFirstTurn: boolean;
  readonly normalSummonsPerTurn: number;
  readonly attacksPerCharacter: number;
  readonly attackingRestsAttacker: boolean;
  /** Only rested characters can be attacked. */
  readonly canAttackStandingCharacter: boolean;
  /** No blockers. */
  readonly blocking: boolean;
  /** Damage/bonuses reset at END_TURN. */
  readonly damageWipesAtEndOfTurn: boolean;
  /** No counter-damage to the attacker. */
  readonly attackerTakesNoDamage: boolean;
  /** Leader loses life equal to the attacker's DAMAGE stat. */
  readonly damageToLeaderUses: "damage" | "power";
  /** Character takes the attacker's POWER as damage. */
  readonly damageToCharacterUses: "damage" | "power";
  readonly recoveryFromTurn: number;
  readonly deckOutLoses: boolean;
  readonly leaderCanAttack: boolean;
  readonly leaderAttacksPerTurn: number;
  readonly leaderEffectRestsLeader: boolean;
  readonly interruptedAttackUsesAttacker: boolean;
  readonly maxCopiesPerCard: number | null;
  readonly characterLimit: number | null;
  readonly characterSlotsShown: number;
  readonly supportSlots: number;
  readonly startingLeaderLife: number;
  readonly supportFromHandOnYourTurn: boolean;
}

export const NARUTO_RULES_SOURCE: RuleSourceReference = {
  url: "https://www.naruto-cardgame.com/en/welcome/",
  accessedOn: "2026-08-02",
  reviewedContentSha256: "57a0c49dd8b06f9f98067121da7209edbebf4ef0eaeb2ddcaba729ee177c5ec0",
  scope:
    "Current welcome-page statements only: five named card types, a stated 51-card deck whose composition is unspecified, five Chakra cards, one Summon card, Character selection based on Leader color, EX conditions, resting the Summon card to deploy, face-down Chakra support activation, and leader-life-zero victory.",
  evidenceManifest: "packages/cards/card-source-manifest.json",
} as const;

export const CONFIRMED_STRUCTURAL_RULES: ConfirmedStructuralRules = {
  totalDeckSize: 51,
  chakraCount: 5,
  summonCount: 1,
  cardTypes: ["leader", "character", "ex_character", "chakra", "summon"],
  charactersChosenByLeaderColor: true,
  exCharactersRequireConditions: true,
  summonRestsToDeploy: true,
  chakraActivatesFaceDownSupports: true,
  leaderLifeZeroLoses: true,
} as const;

export const PROVISIONAL_RULES: ProvisionalRules = {
  mainDeckSize: 50,
  openingHand: 5,
  mulliganForSecondPlayer: true,
  firstTurnDraw: 1,
  normalDraw: 2,
  noAttackOnFirstTurn: true,
  normalSummonsPerTurn: 1,
  attacksPerCharacter: 1,
  attackingRestsAttacker: true,
  canAttackStandingCharacter: false,
  blocking: false,
  damageWipesAtEndOfTurn: true,
  attackerTakesNoDamage: true,
  damageToLeaderUses: "damage",
  damageToCharacterUses: "power",
  recoveryFromTurn: 2,
  deckOutLoses: true,
  leaderCanAttack: true,
  leaderEffectRestsLeader: false,
  leaderAttacksPerTurn: 1,
  interruptedAttackUsesAttacker: true,
  maxCopiesPerCard: 4,
  characterLimit: null,
  characterSlotsShown: 5,
  supportSlots: 5,
  startingLeaderLife: 15,
  supportFromHandOnYourTurn: true,
} as const;

export interface RulesProfile {
  readonly id: "naruto-preview-v1";
  readonly version: 1;
  readonly status: "provisional";
  readonly source: RuleSourceReference;
  readonly confirmed: ConfirmedStructuralRules;
  readonly provisional: ProvisionalRules;
}

/** The only runtime profile bundled by this engine. */
export const NARUTO_PREVIEW_RULES_PROFILE: RulesProfile = {
  id: "naruto-preview-v1",
  version: 1,
  status: "provisional",
  source: NARUTO_RULES_SOURCE,
  confirmed: CONFIRMED_STRUCTURAL_RULES,
  provisional: PROVISIONAL_RULES,
} as const;
