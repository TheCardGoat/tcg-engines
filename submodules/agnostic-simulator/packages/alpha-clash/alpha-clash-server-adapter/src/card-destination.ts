import type { AcEffect } from "@tcg/alpha-clash-types";
import type { CardDestinationPresentation } from "@tcg/protocol";

/** Describe the selected card's effect, not a later effect on another object. */
export function cardDestination(
  effects: readonly AcEffect[],
): CardDestinationPresentation | undefined {
  for (const effect of effects) {
    switch (effect.type) {
      case "selectCards":
        return cardDestination(effect.then);
      case "resolveSelected":
        return cardDestination(effect.effects);
      case "discardSelected":
      case "discardTarget":
        return destination("Oblivion", "Discard card");
      case "banish":
        return destination("Banished Zone", "Banish card");
      case "sendToOblivion":
        return destination("Oblivion", "Send to Oblivion");
      case "returnToHand":
        return destination("Hand", "Return to hand");
      case "returnToDeckTop":
        return destination("Top of deck", "Return to top of deck");
      case "returnToDeckBottom":
        return destination("Bottom of deck", "Return to bottom of deck");
      case "tutor": {
        const labels = {
          hand: "Hand",
          clash: "Clash Zone",
          resource: "Resource Zone",
          oblivion: "Oblivion",
          topOfDeck: "Top of deck",
          bottomOfDeck: "Bottom of deck",
          accessoryZone: "Accessory Zone",
          clashground: "Clashground Zone",
        };
        const label = labels[effect.destination];
        return destination(label, `Put into ${label.toLowerCase()}`);
      }
      case "revealCards": {
        // Reveal itself never transfers a card (703.8b). A following move is separate.
        return (
          cardDestination(effects.slice(effects.indexOf(effect) + 1)) ?? {
            ...destination("Current zone · reveal only", "Reveal card"),
            staysInZone: true,
          }
        );
      }
    }
  }
  return undefined;
}
export function destination(label: string, confirmText: string): CardDestinationPresentation {
  return { label: { key: label }, confirmText: { key: confirmText } };
}
