import { getPrintedCard as getCard } from "@tcg/alpha-clash-cards";
import type {
  ChoiceSlot,
  ChoiceToken,
  ChoiceAssignments,
} from "@tcg/simulator-presentation/choice-drag";
import type { LiveBoardCard, LiveBoardState } from "./components/board-types";
import { cardArtwork } from "./components/Arena3D/card-artwork";
export const boardChoiceCases = [
  ["resources", "01 · Resources and colors"],
  ["costs", "02 · Cost routes"],
  ["targets", "03 · Targets and retargeting"],
  ["options", "04 · Modes, colors, names, yes/no"],
  ["number", "05 · X, count and health"],
  ["allocation", "06 · Damage and counters"],
  ["destination", "07 · Card destinations and reveal"],
  ["search", "08 · Search and retrieve"],
  ["foretell", "09 · Top / Bottom"],
  ["ordering", "10 · Simultaneous order"],
  ["optional", "11 · Optional effects"],
  ["inspect", "12 · Inspect and arrange"],
] as const;
export type BoardChoiceCase = (typeof boardChoiceCases)[number][0];
export function isBoardChoiceCase(value: string): value is BoardChoiceCase {
  return boardChoiceCases.some(([id]) => id === value);
}
function card(
  id: string,
  definitionId: string,
  zone: string,
  controller = "player-one",
): LiveBoardCard {
  const definition = getCard(definitionId);
  return {
    instanceId: id,
    definitionId,
    imageUrl: `https://tcgplayer-cdn.tcgplayer.com/product/${definition.printings[0]?.productId}_400w.jpg`,
    name: definition.name,
    zone,
    controller,
    ready: true,
    faceDown: false,
    clashDamage: 0,
    phaseDamage: 0,
  };
}
export function choiceBoard(): LiveBoardState {
  return {
    cards: [
      ...Array.from(
        { length: 5 },
        (_, index): LiveBoardCard => ({
          instanceId: `opponent-hand-${index}`,
          definitionId: null,
          name: null,
          zone: "hand",
          controller: "player-two",
          ready: true,
          faceDown: true,
          clashDamage: 0,
          phaseDamage: 0,
        }),
      ),
      ...["ac-ac1-027", "ac-ac1-051", "ac-ac1-108", "ac-ac7-004"].map((id, index) =>
        card(`opponent-resource-${index}`, id, "resource", "player-two"),
      ),
      card("hero", "ac-st-001", "contender"),
      card("rival", "ac-ac1-096", "contender", "player-two"),
      card("ally-1", "ac-ac1-027", "clash"),
      card("ally-2", "ac-ac1-028", "clash"),
      card("ally-3", "ac-ac1-108", "clash"),
      card("enemy-1", "ac-ac1-030", "clash", "player-two"),
      card("enemy-2", "ac-ac1-029", "clash", "player-two"),
      card("weapon", "ac-ac7-033", "accessory"),
      card("hand-1", "ac-ac1-051", "hand"),
      card("hand-2", "ac-ac1-029", "hand"),
      card("hand-3", "ac-ac6-142", "hand"),
      card("hand-4", "ac-ac7-004", "hand"),
      card("pile-1", "ac-ac1-027", "oblivion"),
      card("pile-2", "ac-ac1-028", "oblivion"),
      card("pile-3", "ac-ac1-030", "oblivion"),
      card("look-1", "ac-ac1-027", "deck"),
      card("look-2", "ac-ac1-028", "deck"),
      card("look-3", "ac-ac1-030", "deck"),
      ...[
        "ac-ac1-051",
        "ac-ac1-029",
        "ac-ac6-142",
        "ac-ac7-004",
        "ac-ac1-108",
        "ac-ac1-051",
        "ac-ac1-027",
      ].map((id, i) => card(`resource-${i + 1}`, id, "resource")),
    ],
    players: {
      "player-one": { name: "You", health: 25, maxHealth: 30, handSize: 4, deckSize: 32 },
      "player-two": { name: "Opponent", health: 30, maxHealth: 30, handSize: 5, deckSize: 34 },
    },
    activePlayer: "player-one",
    turnNumber: 5,
    phaseName: "primary",
    portalOpen: true,
    clash: null,
    standbyCount: 0,
  };
}
export interface BoardChoiceFixture {
  sourceId: string;
  title: string;
  instruction: string;
  note: string;
  tokens: ChoiceToken[];
  slots: ChoiceSlot[];
  initial?: ChoiceAssignments;
  requiredTotal?: number;
  numeric?: { min: number; max: number; label: string };
}
export const variants: Record<BoardChoiceCase, readonly string[]> = {
  resources: ["Colored payment"],
  costs: ["Normal", "Alternative", "Additional"],
  targets: ["Select", "Ordered", "Retarget"],
  options: ["Modes", "Colors", "Names", "Yes / No"],
  number: ["X", "Count", "Health"],
  allocation: ["Barrage", "Counters"],
  destination: ["Discard", "Banish", "Return", "Reveal", "Send", "Select"],
  search: ["Search", "Retrieve", "No matches"],
  foretell: ["Top / Bottom"],
  ordering: ["Effects", "Oblivion"],
  optional: ["Restore", "Wrath", "Void", "Temper"],
  inspect: ["Inspection", "Public pile", "Hand order"],
};
export function buildBoardChoice(
  kind: BoardChoiceCase,
  variant: string,
  board: LiveBoardState,
  route?: string,
): BoardChoiceFixture {
  const token = (id: string): ChoiceToken => {
    const c = board.cards.find((c) => c.instanceId === id)!;
    return { id, label: c.name ?? "Card", imageUrl: cardArtwork(c), detail: c.zone };
  };
  const labels = (values: string[]) => values.map((label) => ({ id: label, label }));
  const slot = (
    id: string,
    label: string,
    accepts: string[],
    min = 1,
    max = min,
    ordered = false,
  ): ChoiceSlot => ({ id, label, accepts, min, max, ordered });
  const own = ["ally-1", "ally-2", "ally-3"];
  const enemy = ["enemy-1", "enemy-2"];
  const hands = board.cards
    .filter((c) => c.zone === "hand" && c.controller === "player-one")
    .map((c) => c.instanceId);
  const pile = ["pile-1", "pile-2", "pile-3"];
  const look = ["look-1", "look-2", "look-3"];
  const base = {
    sourceId: "ac-ac1-029",
    title: "Choose cards",
    instruction:
      "Drag a card or marker into a highlighted destination. Keyboard: pick up with Enter, then activate a destination.",
    note: "Presentation fixture. Source text is a reference; this draft is not submitted to the game engine.",
  };
  switch (kind) {
    case "resources": {
      const ids = ["white-1", "green-2", "red-3", "black-4", "red-5"];
      return {
        ...base,
        sourceId: "ac-ac1-051",
        title: "Pay 2 · one White required",
        instruction:
          "Drag a White marker into White, and a different resource into Any color. Resources remain in their zone until confirmation.",
        tokens: ids.map((id, i) => ({ id, label: `${id.split("-")[0]} · resource ${i + 1}` })),
        slots: [slot("white", "White", [ids[0]]), slot("any", "Any color", ids)],
      };
    }
    case "costs": {
      const options = variant === "Additional" ? ["additional"] : ["normal", "alternative"];
      const resourceIds = ["white-1", "green-2", "red-3", "black-4", "red-5", "white-6", "green-7"];
      const required = variant === "Additional" ? "green" : "white";
      return {
        ...base,
        sourceId: variant === "Additional" ? "ac-ac7-069" : "ac-ac3-063",
        title: `${variant} cost`,
        instruction:
          "Place the cost route first. Complete all payment slots before confirming. Additional costs also require the normal resource payment.",
        tokens: [
          ...labels(options),
          ...labels(resourceIds),
          ...(variant === "Additional" ? [token("weapon")] : [token("ally-3")]),
        ],
        slots: [
          slot("route", "Cost route", options),
          ...(route && options.includes(route)
            ? route === "alternative"
              ? [slot("payment", "Send a Clash costing 5+ to Oblivion", ["ally-3"])]
              : [
                  slot(
                    "colored",
                    `${required} resources`,
                    resourceIds.filter((id) => id.startsWith(required)),
                    2,
                  ),
                  slot("generic", "Any color", resourceIds, variant === "Additional" ? 2 : 3),
                  ...(variant === "Additional"
                    ? [slot("payment", "Send a non-token Accessory to Oblivion", ["weapon"])]
                    : []),
                ]
            : []),
        ],
      };
    }
    case "targets":
      return {
        ...base,
        title: "Choose another friendly Clash",
        instruction:
          variant === "Retarget"
            ? "Move the selected target marker to another legal card. Illegal drops leave the draft unchanged."
            : "Drag the targeting handle to a highlighted card on the board.",
        tokens: labels(variant === "Ordered" ? ["Target 1", "Target 2"] : ["Target 1"]),
        slots: own
          .slice(0, 2)
          .map((id) =>
            slot(
              id,
              token(id).label,
              variant === "Ordered" ? ["Target 1", "Target 2"] : ["Target 1"],
              0,
              1,
            ),
          ),
        requiredTotal: variant === "Ordered" ? 2 : 1,
        initial: variant === "Retarget" ? { "ally-1": ["Target 1"] } : undefined,
      };
    case "options": {
      const names = board.cards
        .filter((c) => c.zone !== "resource" && c.name !== null)
        .map((c) => c.name!)
        .filter((v, i, a) => a.indexOf(v) === i);
      const values =
        variant === "Modes"
          ? ["Gain two health", "Draw one card"]
          : variant === "Colors"
            ? ["White", "Blue", "Black", "Red", "Green"]
            : variant === "Yes / No"
              ? ["Yes", "No"]
              : names;
      return {
        ...base,
        sourceId: "ac-ac1-051",
        title: `Choose · ${variant}`,
        tokens: labels(values),
        slots: [slot("choice", "Chosen option", values)],
        instruction:
          "Drag a labelled option into the choice slot. Search filters long lists. Remove the selected option to change it.",
      };
    }
    case "number":
      return {
        ...base,
        sourceId: "ac-ac7-001",
        title: `Choose ${variant}`,
        instruction: "Drag the value slider. The current value and legal limits remain visible.",
        note:
          base.note +
          " This is a bounded-value control test, not a claim that this card lets you choose arbitrary health payment.",
        tokens: [],
        slots: [],
        numeric: {
          min: 0,
          max: variant === "Health" ? board.players["player-one"].health - 1 : 10,
          label: variant,
        },
      };
    case "allocation": {
      const values = Array.from(
        { length: 6 },
        (_, i) => `${variant === "Barrage" ? "Damage" : "Counter"} ${i + 1}`,
      );
      return {
        ...base,
        sourceId: "ac-ac1-108",
        title: variant === "Barrage" ? "Barrage 2 · divide 6 damage" : "Allocate 6 counters",
        tokens: labels(values),
        slots: enemy.map((id) => slot(id, token(id).label, values, 0, 6)),
        requiredTotal: 6,
        instruction:
          "Drag each amount marker onto either highlighted target. All six must be assigned. Each selected target receives at least one.",
        note:
          base.note +
          (variant === "Counters"
            ? " Counter allocation is a generic control test."
            : " Machina has 6 initial attack and Barrage 2."),
      };
    }
    case "destination":
      return {
        ...base,
        sourceId: variant === "Discard" ? "ac-ac1-001" : "ac-ac1-056",
        title: `${variant} a card`,
        instruction:
          variant === "Reveal"
            ? "Place a card into Reveal. Confirming reveals it without changing its zone."
            : `Place one eligible card into ${variant}. Only confirmation applies the preview change.`,
        tokens: (variant === "Return" || variant === "Send" ? own : hands).map(token),
        slots: [
          slot("destination", variant, variant === "Return" || variant === "Send" ? own : hands),
        ],
      };
    case "search":
      return {
        ...base,
        sourceId: variant === "Retrieve" ? "ac-ac3-p01" : "ac-ac1-049",
        title: variant === "Retrieve" ? "Retrieve from public Oblivion" : "Search permitted cards",
        instruction:
          "Only the permitted candidate set is exposed. Select a card for Hand. The fixture does not expose the opponent’s hand or deck.",
        tokens:
          variant === "No matches"
            ? []
            : (variant === "Retrieve" ? pile.slice(0, 2) : look).map(token),
        slots: [
          slot(
            "hand",
            "Hand",
            variant === "No matches" ? [] : variant === "Retrieve" ? pile.slice(0, 2) : look,
          ),
        ],
        note:
          base.note +
          " Search candidates are an authorized preview set; search shuffle is not simulated.",
      };
    case "foretell":
      return {
        ...base,
        sourceId: "ac-ac4-067",
        title: "Foretell two cards",
        instruction:
          "Place both permitted cards into Top or Bottom. Drag a card onto a numbered entry to insert before it. First in Top will be drawn next.",
        tokens: look.slice(0, 2).map(token),
        slots: [
          slot("top", "Top", look.slice(0, 2), 0, 2, true),
          slot("bottom", "Bottom", look.slice(0, 2), 0, 2, true),
        ],
        requiredTotal: 2,
        note:
          base.note +
          " These two identities represent the permitted top-deck look; confirming records order and does not execute the subsequent draw.",
      };
    case "ordering": {
      const ids = variant === "Oblivion" ? pile : own.slice(0, 2);
      return {
        ...base,
        sourceId: "ac-ac1-028",
        title: `Order ${variant.toLowerCase()}`,
        tokens: ids.map(token),
        slots: [
          slot(
            "order",
            variant === "Oblivion" ? "Oblivion arrival order" : "Effect resolution order",
            ids,
            ids.length,
            ids.length,
            true,
          ),
        ],
        initial: { order: ids },
        instruction:
          "Drag an entry onto another entry to insert before it. Drag to the tray to put it last. Confirm to record the order.",
      };
    }
    case "optional": {
      const choices = variant === "Void" ? ["Resolve"] : ["Use", "Decline"];
      const using = route === "Use";
      const follow =
        variant === "Wrath" ? ["hand-3"] : variant === "Temper" ? ["weapon"] : ["pile-1"];
      return {
        ...base,
        sourceId:
          variant === "Wrath"
            ? "ac-ac6-145"
            : variant === "Void"
              ? "ac-ac7-004"
              : variant === "Temper"
                ? "ac-ac7-055"
                : "ac-tp1-017",
        title: `${variant} · ${variant === "Void" ? "trigger" : "optional effect"}`,
        instruction:
          variant === "Void"
            ? "Breach the Void has no optional payment. Resolve its draw trigger after the banishing effect completes."
            : variant === "Restore"
              ? "After dealing clash damage, choose Use to put the top card of Oblivion on the bottom of your deck. Other Oblivion cards are not eligible."
              : variant === "Wrath"
                ? "Use: reveal a Dragon costing more than 3, put it on the bottom of the deck, then choose an opposing Clash for 3 damage."
                : "Use to put a Temper counter on the designated Weapon. Decline leaves it unchanged.",
        tokens: [
          ...labels(choices),
          ...(using ? follow.map(token) : []),
          ...(using && variant === "Wrath" ? labels(["Target"]) : []),
        ],
        slots: [
          slot("branch", variant === "Void" ? "Resolve trigger" : "Use effect?", choices),
          ...(using
            ? [
                slot(
                  "followup",
                  variant === "Wrath"
                    ? "Reveal Dragon → deck bottom"
                    : variant === "Restore"
                      ? "Top of Oblivion → deck bottom"
                      : "Designated Weapon",
                  follow,
                ),
              ]
            : []),
          ...(using && variant === "Wrath"
            ? enemy.map((id) => slot(id, token(id).label, ["Target"], 0, 1))
            : []),
        ],
        requiredTotal: using && variant === "Wrath" ? 3 : undefined,
        note:
          base.note +
          " Rulebook 8.0: 704.26 Restore; 704.29 Wrath; 704.32 Temper; 704.34 Void. Only a Void trigger with an optional payment offers a decline choice.",
      };
    }
    case "inspect": {
      const ids =
        variant === "Hand order" ? hands : variant === "Public pile" ? pile : [...own, ...hands];
      return {
        ...base,
        title: variant,
        tokens: ids.map(token),
        slots: [
          slot(
            "inspection",
            variant === "Hand order" ? "Local hand order" : "Inspect",
            ids,
            variant === "Hand order" ? ids.length : 1,
            variant === "Hand order" ? ids.length : 1,
            true,
          ),
        ],
        initial: variant === "Hand order" ? { inspection: ids } : undefined,
        instruction:
          variant === "Hand order"
            ? "Reorder locally. This never changes engine hand order or any public pile order."
            : "Drag a visible card into Inspect to lift it above the board. Close it to return to the board. Public pile order is read-only.",
      };
    }
  }
}
