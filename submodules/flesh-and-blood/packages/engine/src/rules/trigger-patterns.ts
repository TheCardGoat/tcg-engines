import type {
  FabCondition,
  FabSingleTriggerEventPattern,
  FabTrigger,
} from "@tcg/flesh-and-blood-types";

export function fabTriggerEventPatterns(
  trigger: FabTrigger,
): readonly FabSingleTriggerEventPattern[] {
  if (trigger.kind === "state") return [];
  return "patterns" in trigger.event ? trigger.event.patterns : [trigger.event];
}

export function fabTriggerStateCondition(trigger: FabTrigger): FabCondition | null {
  return trigger.kind === "event" ? null : trigger.state;
}

export function fabTriggerObservesEvent(trigger: FabTrigger, name: string): boolean {
  return fabTriggerEventPatterns(trigger).some((pattern) => pattern.name === name);
}
