import classes from "./creator.module.css";

const interactions = [
  ["Find a card", "Open Cards. Search by name, or filter by Type, Color, and cost."],
  [
    "Place a card",
    "Drag a card from the catalog into either player's zone. Or click the card, then click a zone. Repeat to add another copy. Field accepts Units and Legends; Legends accepts Legends.",
  ],
  [
    "Move a card",
    "Drag a placed card into another zone or to the other player. Or select it, then click the destination zone.",
  ],
  [
    "Attach gear",
    "Set Type to gear. Drag the gear onto a Unit or Legend's card image, or click the gear and then its host. Drop onto the card, not the empty Field.",
  ],
  [
    "Edit or remove a card",
    "Use Clear selection first. Click a placed card to open its controls. Change Spent or Face down, remove the card, or use Detach to remove gear.",
  ],
  [
    "Set deck order",
    "Cards enter the bottom of the deck. The first card is the top. Select a deck card and use Move to deck top to draw it first.",
  ],
  [
    "Change Eddies",
    "Open Eddies, choose a player, and set available and spent Eddies. You can also click the player's Eddies on the preview.",
  ],
  [
    "Change Gigs",
    "Open Gigs, choose a player, add a die, and set its face. Each player can use each die size once. Click Gigs on the preview to open these tools.",
  ],
  [
    "Save or load a scene",
    "Open Scene settings to name the scene, choose the starting player, download it, or paste saved scene JSON. Changes save in this browser.",
  ],
  [
    "Play and edit again",
    "Play table starts a new game from the scene with the bot off. Use Switch player to control the other side. Match → Edit board state opens the current table. Cancel edits returns to that game.",
  ],
  [
    "Control the bot",
    "In Match, select Step and use Next bot decision for one decision, or select Auto for continuous play. The board shortcuts let you pause, resume, step, or take over the bot's side.",
  ],
] as const;

export function CreatorHelp() {
  return (
    <details className={classes.help}>
      <summary>How to use the creator table</summary>
      <dl>
        {interactions.map(([title, description]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
