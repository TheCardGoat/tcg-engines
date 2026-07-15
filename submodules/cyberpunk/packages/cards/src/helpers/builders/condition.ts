import type {
  AttackingCondition,
  CardStateCondition,
  CostMatchesGigCondition,
  FightKindCondition,
  HasGigAtMaxValueCondition,
  HasGigPairCondition,
  MatchingGigCondition,
  OvertimeCondition,
  LagCondition,
  StreetCredCondition,
  TargetValueCondition,
  TurnCondition,
} from "@tcg/cyberpunk-types";

export const condition = {
  streetCred: (args: Omit<StreetCredCondition, "condition">): StreetCredCondition => ({
    condition: "streetCred",
    ...args,
  }),
  cardState: (args: Omit<CardStateCondition, "condition">): CardStateCondition => ({
    condition: "cardState",
    ...args,
  }),
  turn: (args: Omit<TurnCondition, "condition">): TurnCondition => ({
    condition: "turn",
    ...args,
  }),
  overtime: (args: Omit<OvertimeCondition, "condition"> = {}): OvertimeCondition => ({
    condition: "overtime",
    ...args,
  }),
  targetValue: (args: Omit<TargetValueCondition, "condition">): TargetValueCondition => ({
    condition: "targetValue",
    ...args,
  }),
  attacking: (args: Omit<AttackingCondition, "condition">): AttackingCondition => ({
    condition: "attacking",
    ...args,
  }),
  hasLag: (args: Omit<LagCondition, "condition">): LagCondition => ({
    condition: "hasLag",
    ...args,
  }),
  hasGigAtMaxValue: (
    args: Omit<HasGigAtMaxValueCondition, "condition">,
  ): HasGigAtMaxValueCondition => ({
    condition: "hasGigAtMaxValue",
    ...args,
  }),
  hasGigPair: (args: Omit<HasGigPairCondition, "condition">): HasGigPairCondition => ({
    condition: "hasGigPair",
    ...args,
  }),
  matchingGig: (args: Omit<MatchingGigCondition, "condition">): MatchingGigCondition => ({
    condition: "matchingGig",
    ...args,
  }),
  fightKind: (args: Omit<FightKindCondition, "condition">): FightKindCondition => ({
    condition: "fightKind",
    ...args,
  }),
  costMatchesGig: (args: Omit<CostMatchesGigCondition, "condition">): CostMatchesGigCondition => ({
    condition: "costMatchesGig",
    ...args,
  }),
};
