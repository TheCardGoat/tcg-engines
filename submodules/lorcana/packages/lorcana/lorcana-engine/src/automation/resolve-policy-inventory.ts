import type { CardInstanceId } from "#core";

export type OptionalResolutionPolicyMetadata = {
  abilityIndex?: number;
  abilityName?: string;
  actorHandCardIds: CardInstanceId[];
  actorHandSize: number;
  actorUninkableHandCount: number;
  allActorHandCardsUninkable: boolean;
  sourceCardId?: CardInstanceId;
  sourceDefinitionId?: string;
};

export type OptionalResolutionPolicyEvaluation = {
  accept: boolean;
  id: string;
  reason: string;
};

type OptionalResolutionPolicy = {
  abilityIndex?: number;
  abilityName?: string;
  evaluate(metadata: OptionalResolutionPolicyMetadata): OptionalResolutionPolicyEvaluation;
  id: string;
  sourceDefinitionId: string;
};

const OPTIONAL_RESOLUTION_POLICIES: readonly OptionalResolutionPolicy[] = [
  {
    id: "doc-bold-knight:drastic-measures",
    sourceDefinitionId: "qUy",
    abilityName: "DRASTIC MEASURES",
    evaluate(metadata) {
      if (metadata.actorHandSize <= 2) {
        return {
          accept: true,
          id: this.id,
          reason: "hand-size-at-most-two",
        };
      }

      if (metadata.allActorHandCardsUninkable) {
        return {
          accept: true,
          id: this.id,
          reason: "all-hand-cards-uninkable",
        };
      }

      return {
        accept: false,
        id: this.id,
        reason: "keep-larger-inkable-hand",
      };
    },
  },
];

function policyMatches(
  policy: OptionalResolutionPolicy,
  metadata: OptionalResolutionPolicyMetadata,
): boolean {
  if (policy.sourceDefinitionId !== metadata.sourceDefinitionId) {
    return false;
  }

  if (
    typeof policy.abilityIndex === "number" &&
    (typeof metadata.abilityIndex !== "number" || policy.abilityIndex !== metadata.abilityIndex)
  ) {
    return false;
  }

  if (
    typeof policy.abilityName === "string" &&
    (typeof metadata.abilityName !== "string" || policy.abilityName !== metadata.abilityName)
  ) {
    return false;
  }

  return true;
}

export function evaluateOptionalResolutionPolicy(
  metadata: OptionalResolutionPolicyMetadata,
): OptionalResolutionPolicyEvaluation | undefined {
  const matchedPolicy = OPTIONAL_RESOLUTION_POLICIES.find((policy) =>
    policyMatches(policy, metadata),
  );
  return matchedPolicy?.evaluate(metadata);
}
