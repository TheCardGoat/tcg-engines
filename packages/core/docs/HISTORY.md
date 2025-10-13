# Game Move History System

The game move history system provides a comprehensive, player-aware logging mechanism for tracking all move executions with i18next-compatible localization support.

## Overview

The history system maintains a chronological log of all moves executed in a game, with support for:

- **Player-aware filtering**: Show different information to different players
- **Multi-level verbosity**: CASUAL, ADVANCED, and DEVELOPER detail levels
- **i18next localization**: Compatible message templates for internationalization
- **Failed moves**: Track both successful and failed move attempts
- **Metadata**: Rich context for debugging and analysis

## Architecture

The history system consists of three main components:

1. **HistoryManager**: In-memory store that tracks all history entries
2. **HistoryOperations**: API exposed to move reducers via `context.history`
3. **RuleEngine integration**: Automatic entry creation and public query API

## Basic Usage

###  Querying History

```typescript
// Get all history (no filtering)
const allHistory = engine.getHistory();

// Get history for a specific player (casual verbosity)
const playerHistory = engine.getHistory({
  playerId: 'player_one',
  verbosity: 'CASUAL'
});

// Get recent history (since timestamp)
const recentHistory = engine.getHistory({
  since: Date.now() - 60000 // Last minute
});

// Get technical details for debugging
const debugHistory = engine.getHistory({
  verbosity: 'DEVELOPER'
});

// Get failed moves only
const failures = engine.getHistory({
  includeSuccess: false
});
```

### Automatic Entry Creation

The engine automatically creates a base history entry for every move execution:

```typescript
// When you execute a move:
engine.executeMove('playCard', {
  playerId: 'player_one',
  params: { cardId: 'card-123' }
});

// The engine automatically adds a history entry with a default message:
// {
//   moveId: 'playCard',
//   playerId: 'player_one',
//   success: true,
//   messages: {
//     visibility: 'PUBLIC',
//     messages: {
//       casual: {
//         key: 'moves.playCard.success',
//         values: { playerId: 'player_one', params: {...} }
//       }
//     }
//   }
// }
```

### Custom History Entries

For moves with complex logic or private information, use `context.history.log()`:

```typescript
export const drawCards = createMove({
  reducer: (draft, context) => {
    const cards = context.zones.drawCards('deck', 'hand', 5);
    
    // Log with player-specific visibility
    context.history.log({
      messages: {
        visibility: 'PLAYER_SPECIFIC',
        messages: {
          // Player who drew sees the cards
          [context.playerId]: {
            casual: {
              key: 'draw.self',
              values: { cards: cards.map(c => c.name), count: 5 }
            },
            advanced: {
              key: 'draw.self.detailed',
              values: { cardIds: cards.map(c => c.id), cards: cards }
            }
          },
          // Opponent only sees count
          [opponentId]: {
            casual: {
              key: 'draw.opponent',
              values: { count: 5 }
            }
          }
        }
      }
    });
  }
});
```

## Visibility Levels

### PUBLIC

Visible to all players with identical messages:

```typescript
context.history.log({
  messages: {
    visibility: 'PUBLIC',
    messages: {
      casual: { key: 'turn.start', values: { turn: 3 } }
    }
  }
});
```

### PRIVATE

Visible only to specified players:

```typescript
context.history.log({
  messages: {
    visibility: 'PRIVATE',
    visibleTo: [playerId], // Only this player can see it
    messages: {
      casual: { key: 'card.revealed', values: { card: 'Knight' } }
    }
  }
});
```

### PLAYER_SPECIFIC

Different messages for different players (most common for private information):

```typescript
context.history.log({
  messages: {
    visibility: 'PLAYER_SPECIFIC',
    messages: {
      [playerId]: {
        casual: { key: 'mulligan.self', values: { cards: [...] } }
      },
      [opponentId]: {
        casual: { key: 'mulligan.opponent', values: { count: 3 } }
      }
    }
  }
});
```

## Verbosity Levels

### CASUAL

Simple, narrative descriptions for casual players:

```
"Player 1 drew 5 cards"
"Opponent mulliganed 3 cards"
```

### ADVANCED

Technical details for competitive players:

```
"Player 1 drew cards: [Knight, Wizard, Dragon, Healer, Archer]"
"Opponent mulliganed 3 cards (IDs: card-1, card-2, card-3)"
```

### DEVELOPER

Full internal details for debugging:

```
"Move: drawCards | Player: player_one | Params: {count: 5, source: 'deck'} | Duration: 15ms"
"Target validation failed: card-123 no longer exists in zone 'play'"
```

### Verbosity Fallback

If a requested verbosity level isn't available, the system falls back:

```
DEVELOPER -> ADVANCED -> CASUAL
ADVANCED -> CASUAL
```

Example:

```typescript
// If only CASUAL is defined:
messages: {
  casual: { key: 'simple.message' }
  // No advanced or developer
}

// Requesting ADVANCED will get CASUAL
// Requesting DEVELOPER will get CASUAL
```

## Message Templates

Message templates use i18next format with interpolation:

### Basic Template

```typescript
{
  key: "moves.playCard",
  values: { player: "Player 1", card: "Knight" }
}

// With i18next translation:
// "moves.playCard": "{{player}} played {{card}}"
// Results in: "Player 1 played Knight"
```

### Complex Values

```typescript
{
  key: "moves.mulligan.self",
  values: {
    cards: ["Knight", "Wizard", "Dragon"],
    count: 3,
    player: "Player 1"
  }
}

// With i18next translation:
// "moves.mulligan.self": "You mulliganed {{count}} cards: {{cards}}"
// Results in: "You mulliganed 3 cards: Knight, Wizard, Dragon"
```

### Nested Values

```typescript
{
  key: "moves.combat.resolution",
  values: {
    attacker: { name: "Knight", power: 5 },
    defender: { name: "Dragon", power: 7 },
    result: "defender_wins"
  }
}

// With i18next translation:
// "moves.combat.resolution": "{{attacker.name}} ({{attacker.power}}) attacks {{defender.name}} ({{defender.power}}): {{result}}"
```

## Example: Mulligan

Complete example showing player-specific visibility and verbosity levels:

```typescript
export const mulligan = createMove({
  reducer: (draft, context) => {
    const { playerId, cardIds } = context.params;
    const cards = context.zones.getCards(cardIds);
    
    // Put cards on bottom of deck and draw new hand
    context.zones.moveCards(cardIds, 'deck', 'bottom');
    context.zones.shuffle('deck');
    const newCards = context.zones.drawCards('deck', 'hand', 7);
    
    // Get opponent ID
    const opponentId = context.game.getPlayers()
      .find(p => p !== playerId);
    
    // Log with player-specific messages
    context.history.log({
      messages: {
        visibility: 'PLAYER_SPECIFIC',
        messages: {
          // Owning player sees their cards
          [playerId]: {
            casual: {
              key: 'mulligan.self.casual',
              values: {
                mulliganedCount: cardIds.length,
                mulliganedCards: cards.map(c => c.name),
                drewCards: newCards.map(c => c.name)
              }
            },
            advanced: {
              key: 'mulligan.self.advanced',
              values: {
                mulliganedIds: cardIds,
                drewIds: newCards.map(c => c.id),
                mulliganedCards: cards,
                drewCards: newCards
              }
            },
            developer: {
              key: 'mulligan.self.developer',
              values: {
                fullContext: context.params,
                zoneState: context.zones.getZoneState()
              }
            }
          },
          // Opponent only sees counts and card colors
          [opponentId]: {
            casual: {
              key: 'mulligan.opponent.casual',
              values: {
                count: cardIds.length,
                colors: cards.map(c => c.color)
              }
            },
            advanced: {
              key: 'mulligan.opponent.advanced',
              values: {
                playerId,
                count: cardIds.length,
                colors: cards.map(c => c.color),
                cardTypes: cards.map(c => c.type)
              }
            }
          }
        }
      },
      metadata: {
        zoneTransition: 'hand -> deck -> hand',
        deckShuffled: true
      }
    });
  }
});
```

### i18next Translation File

```json
{
  "mulligan": {
    "self": {
      "casual": "You mulliganed {{mulliganedCount}} cards and drew: {{drewCards}}",
      "advanced": "Mulligan: Returned {{mulliganedCards}} (IDs: {{mulliganedIds}}), Drew {{drewCards}} (IDs: {{drewIds}})",
      "developer": "Mulligan executed | Context: {{fullContext}} | Zone State: {{zoneState}}"
    },
    "opponent": {
      "casual": "Opponent mulliganed {{count}} cards (colors: {{colors}})",
      "advanced": "Player {{playerId}} mulliganed {{count}} cards | Colors: {{colors}} | Types: {{cardTypes}}"
    }
  }
}
```

## Error Handling

Failed moves are automatically logged with error details:

```typescript
// When a move fails:
engine.executeMove('invalidMove', {...});

// Automatic history entry:
// {
//   moveId: 'invalidMove',
//   success: false,
//   error: {
//     code: 'INVALID_TARGET',
//     message: 'Target no longer exists',
//     context: { targetId: 'card-123' }
//   },
//   messages: {
//     visibility: 'PUBLIC',
//     messages: {
//       casual: {
//         key: 'moves.invalidMove.failure',
//         values: { error: 'Target no longer exists' }
//       },
//       advanced: {
//         key: 'moves.invalidMove.failure.detailed',
//         values: {
//           errorCode: 'INVALID_TARGET',
//           error: 'Target no longer exists'
//         }
//       }
//     }
//   }
// }
```

## Performance Considerations

- **Unlimited storage**: The history stores all moves for the entire game session
- **In-memory only**: History is not persisted to disk
- **Filtering on query**: Player filtering and message formatting happens at query time
- **Network sync**: History entries are separate from state patches (use patches for sync)

## Best Practices

1. **Use player-specific messages for private information**
   - Card draws, hand reveals, hidden information
   - Different detail levels for different players

2. **Provide all verbosity levels when possible**
   - CASUAL for narrative flow
   - ADVANCED for competitive players
   - DEVELOPER for debugging

3. **Keep message keys organized**
   - Use namespaces: `moves.playCard.success`, `abilities.trigger.failed`
   - Group by feature: `combat.*`, `draw.*`, `mulligan.*`

4. **Include context in values**
   - Player names/IDs
   - Card details
   - Relevant game state

5. **Use metadata for debugging**
   - Internal state snapshots
   - Performance metrics
   - Decision trees

## Type Reference

```typescript
// Query options
type HistoryQueryOptions = {
  playerId?: PlayerId;
  verbosity?: 'CASUAL' | 'ADVANCED' | 'DEVELOPER';
  since?: number;
  moveId?: string;
  includeSuccess?: boolean;
  includeFailures?: boolean;
};

// Formatted entry returned by getHistory()
type FormattedHistoryEntry = {
  id: string;
  moveId: string;
  playerId: PlayerId;
  timestamp: number;
  turn?: number;
  phase?: string;
  segment?: string;
  message: MessageTemplateData;
  success: boolean;
  error?: {
    code: string;
    message: string;
    context?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>; // Only in DEVELOPER mode
  params?: unknown; // Only in DEVELOPER mode
};

// Message template
type MessageTemplateData = {
  key: string;
  values?: Record<string, unknown>;
};
```

## Integration with i18next

To use with i18next in your UI:

```typescript
import i18next from 'i18next';

// Get history from engine
const history = engine.getHistory({
  playerId: currentPlayer,
  verbosity: 'CASUAL'
});

// Format messages with i18next
const formattedHistory = history.map(entry => ({
  ...entry,
  formattedMessage: i18next.t(entry.message.key, entry.message.values)
}));

// Display in UI
formattedHistory.forEach(entry => {
  console.log(`[${entry.phase}] ${entry.formattedMessage}`);
});
```

## See Also

- [Logging System](./LOGGING.md) - Engine-level logging for development
- [Telemetry System](./TELEMETRY.md) - Event tracking and analytics
- [Move System](./guides/moves.md) - Creating and executing moves

