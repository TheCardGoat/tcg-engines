import type { CardEffects } from "@tcg/op-types";

/** Stop regeneration when incomplete source text or parsing would remove a Trigger. */
export function assertTriggerPreserved(options: {
  cardId: string;
  printedText: string;
  current: CardEffects | undefined;
  generated: CardEffects | undefined;
}): void {
  const existingTrigger = options.current?.effects?.some((block) => block.trigger === "trigger");
  const suppliedTrigger = /(?:^|\n)\s*\[Trigger\]/i.test(options.printedText);
  const generatedTrigger = options.generated?.effects?.some((block) => block.trigger === "trigger");
  if ((existingTrigger || suppliedTrigger) && !generatedTrigger) {
    throw new Error(
      `${options.cardId}: regeneration would lose an existing or supplied Trigger ability. Review the official Trigger text and parser before writing; no effects were replaced.`,
    );
  }
}
