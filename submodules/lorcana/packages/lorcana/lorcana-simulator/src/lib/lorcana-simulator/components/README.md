# Tabletop Board Simulator Components

A realistic tabletop TCG board simulator with well-defined zones, consistent aspect ratio, and polished visual design.

## Features

### 🎮 Board Layout

- **Fixed Aspect Ratio**: Board maintains a consistent 16:10 aspect ratio
- **Responsive Design**: Empty space is added around the board when viewport doesn't match the ratio
- **Realistic Table Surface**: Gradient playmat with subtle grid texture and inner borders

### 🎯 Zones

Each player has five clearly defined zones:

| Zone          | Purpose                  | Visual Style                            |
| ------------- | ------------------------ | --------------------------------------- |
| **Hand**      | Cards in hand (fanned)   | Arc fan arrangement with hover lift     |
| **Play Area** | Characters/Items in play | Grid layout with drop targets           |
| **Inkwell**   | Ink resources            | Stacked cards with ready/exerted states |
| **Deck**      | Draw pile                | Stacked card backs with count           |
| **Discard**   | Discard pile (future)    | Pile visualization                      |

### 🎨 Visual Design

- **Card Backs**: Radial gradient with subtle pattern
- **Card Faces**: Gradient frame with art placeholder
- **Hover Effects**: Cards lift on hover with smooth transitions
- **Drag & Drop**: Visual feedback with ghost card and drop indicators
- **Selection**: Golden outline glow for selected cards
- **Masked Cards**: Visual treatment for opponent's hidden cards

### 🖱️ Interactions

- **Card Hover**: Tooltip with card details
- **Card Drag**: Drag cards between zones
- **Click Selection**: Click to select cards
- **Zone Hover**: Highlight drop targets during drag

## Component Structure

```
TabletopBoard
├── TabletopBoard.svelte    # Main board container
├── Card.svelte             # Individual card component
├── CardTooltip.svelte      # Hover tooltip
├── BoardZone.svelte        # Play area zone
├── HandZone.svelte         # Hand fan zone
├── InkwellZone.svelte      # Ink resource zone
├── DeckZone.svelte         # Deck pile zone
└── LoreCounter.svelte      # Lore score display
```

## Usage

```svelte
<script>
  import { TabletopBoard } from "$lib/lorcana-simulator/components";
  import type { BoardSnapshot, LorcanaSimulatorView } from "$lib/lorcana-simulator/types";

  let boardSnapshot: BoardSnapshot | null = $state(null);
  let view: LorcanaSimulatorView = "authoritative";
  let selectedCardId = $state<string | null>(null);

  function handleCardClick(card) {
    selectedCardId = card.cardId;
  }

  function handleCardDrop(cardId, targetZone, targetPlayer) {
    // Move card logic
  }
</script>

<TabletopBoard
  {boardSnapshot}
  {view}
  {selectedCardId}
  onCardClick={handleCardClick}
  onCardDrop={handleCardDrop}
/>
```

## Architecture

### State Flow

1. **Session** provides `BoardSnapshot` with all card positions
2. **TabletopBoard** renders zones based on snapshot
3. **User interactions** trigger callbacks to session
4. **Session updates** → new snapshot → re-render

### View Modes

- **authoritative**: See all cards (debug/admin)
- **playerOne**: See player 1's hand, mask player 2's private zones
- **playerTwo**: See player 2's hand, mask player 1's private zones
- **spectator**: Mask all private zones for both players

### Drag & Drop

- Drag starts on pointer down (with threshold)
- Ghost card follows cursor
- Drop zones highlight on hover
- Drop completes on pointer up

## CSS Variables

```css
/* Board theming */
--board-bg: #1e3a5f;
--board-bg-gradient-start: #264a73;
--board-bg-gradient-end: #1a3252;
--zone-bg: rgba(15, 30, 50, 0.6);
--zone-border: rgba(100, 150, 200, 0.2);
--zone-active: rgba(100, 180, 255, 0.15);
--text-primary: #e8f4fc;
--text-secondary: #9db8d0;
--accent: #f59e0b;
--accent-glow: rgba(245, 158, 11, 0.4);
```

## Responsive Behavior

| Viewport            | Behavior                    |
| ------------------- | --------------------------- |
| Large (>1200px)     | Full size with padding      |
| Medium (900-1200px) | Reduced padding             |
| Small (600-900px)   | Compact zones               |
| Mobile (<600px)     | Stacked layout, full height |

## Best Practices

1. **Always use BoardSnapshot** as source of truth
2. **Handle view masking** - don't reveal private cards
3. **Provide visual feedback** for all interactions
4. **Maintain aspect ratio** for consistent gameplay feel
5. **Support drag & drop** for intuitive card movement
