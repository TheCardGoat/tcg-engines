/** Presentation-only draft. The caller supplies viewer-safe candidates and legal slots. */
export interface ChoiceToken {
  id: string;
  label: string;
  imageUrl?: string;
  detail?: string;
}
export interface ChoiceSlot {
  id: string;
  label: string;
  accepts: readonly string[];
  min: number;
  max: number;
  ordered?: boolean;
}
export type ChoiceAssignments = Readonly<Record<string, readonly string[]>>;
export function placeChoice(
  slots: readonly ChoiceSlot[],
  value: ChoiceAssignments,
  token: string,
  destination: string,
  before?: string,
): ChoiceAssignments {
  const slot = slots.find((s) => s.id === destination);
  if (!slot?.accepts.includes(token) || before === token) return value;
  const existing = value[destination] ?? [];
  if (!existing.includes(token) && existing.length >= slot.max) return value;
  const next: Record<string, string[]> = Object.fromEntries(
    slots.map((s) => [s.id, (value[s.id] ?? []).filter((id) => id !== token)]),
  );
  const group = next[destination];
  const index = before ? group.indexOf(before) : -1;
  group.splice(index < 0 ? group.length : index, 0, token);
  return next;
}
export function removeChoice(value: ChoiceAssignments, token: string): ChoiceAssignments {
  return Object.fromEntries(
    Object.entries(value).map(([id, tokens]) => [id, tokens.filter((t) => t !== token)]),
  );
}
export function choiceProblems(slots: readonly ChoiceSlot[], value: ChoiceAssignments): string[] {
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const slot of slots) {
    const ids = value[slot.id] ?? [];
    if (ids.length < slot.min || ids.length > slot.max)
      errors.push(
        `${slot.label}: choose ${slot.min === slot.max ? slot.min : `${slot.min}–${slot.max}`}.`,
      );
    for (const id of ids) {
      if (!slot.accepts.includes(id) || seen.has(id))
        errors.push(`${slot.label}: invalid or repeated selection.`);
      seen.add(id);
    }
  }
  if (Object.keys(value).some((id) => !slots.some((s) => s.id === id)))
    errors.push("Unknown destination.");
  return errors;
}
