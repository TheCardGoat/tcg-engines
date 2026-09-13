import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveEffect,
  GrandArchiveSubject,
  GrandArchiveCondition,
} from "@tcg/grand-archive-types";

// Paragraphs are compiled independently, but their announcement targets share
// one card activation. Rename colliding declarations and their typed references.
// Unknown reference-bearing shapes fail closed instead of silently misbinding.
export function scopeResolutionTargets(
  abilities: readonly GrandArchiveAbilityDefinition[],
): readonly GrandArchiveAbilityDefinition[] {
  const used = new Set<string>();
  return abilities.map((ability) => {
    if (ability.kind !== "card-resolution") return ability;
    const renames = new Map<string, string>();
    for (const target of ability.targets ?? []) {
      if (used.has(target.id)) renames.set(target.id, `${ability.id}:${target.id}`);
      used.add(target.id);
    }
    if (!renames.size) return ability;
    const subject = (value: GrandArchiveSubject): GrandArchiveSubject =>
      value.kind === "bound"
        ? { ...value, binding: renames.get(value.binding) ?? value.binding }
        : value;
    const condition = (value: GrandArchiveCondition): GrandArchiveCondition =>
      value.kind === "subject-matches" ? { ...value, subject: subject(value.subject) } : value;
    const effect = (value: GrandArchiveEffect): GrandArchiveEffect => {
      switch (value.kind) {
        case "sequence": {
          const [first, ...rest] = value.effects;
          return { ...value, effects: [effect(first), ...rest.map(effect)] };
        }
        case "conditional":
          return {
            ...value,
            condition: condition(value.condition),
            then: effect(value.then),
            ...(value.else ? { else: effect(value.else) } : {}),
          };
        case "optional":
          return { ...value, effect: effect(value.effect) };
        case "deal-damage":
          return {
            ...value,
            ...(value.source ? { source: subject(value.source) } : {}),
            recipient: subject(value.recipient),
          };
        case "continuous":
          return { ...value, subjects: subject(value.subjects) };
        case "add-counter":
        case "remove-counter":
        case "set-object-state":
          return { ...value, subject: subject(value.subject) };
        case "keyword-action":
          return "subject" in value && value.subject
            ? { ...value, subject: subject(value.subject) }
            : value;
        case "negate-triggered-abilities":
          return { ...value, source: subject(value.source) };
        default:
          return value;
      }
    };
    const scoped = {
      ...ability,
      targets: ability.targets?.map((target) => ({
        ...target,
        id: renames.get(target.id) ?? target.id,
      })),
      effect: effect(ability.effect),
    };
    function hasOldReference(value: unknown): boolean {
      if (typeof value === "string") return renames.has(value);
      if (Array.isArray(value)) return value.some(hasOldReference);
      if (value !== null && typeof value === "object")
        return Object.values(value).some(hasOldReference);
      return false;
    }
    if (hasOldReference(scoped))
      return {
        id: ability.id,
        kind: "unparsed",
        text: ability.text,
        unparsedSegments: [ability.text],
      };
    return scoped;
  });
}
