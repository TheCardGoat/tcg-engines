# Riftbound Game Flow Charts

## Game Setup Flow

```mermaid
flowchart TD
    A[Game Start] --> B[Each player draws 7 cards]
    B --> C[Determine first player randomly]
    C --> D[First player draws 1 additional card]
    D --> E[Players may mulligan once]
    E --> F[Place decks in deck zones]
    F --> G[Game begins with first player's turn]
```

## Turn Structure

```mermaid
flowchart TD
    A[Turn Start] --> B[Draw Phase]
    B --> C[Main Phase]
    C --> D[Combat Phase]
    D --> E[End Phase]
    E --> F[Next Player's Turn]
    
    B --> B1[Draw 1 card from deck]
    B1 --> B2[Trigger draw effects]
    
    C --> C1[Play cards from hand]
    C1 --> C2[Activate abilities]
    C2 --> C3[Use items/equipment]
    
    D --> D1[Declare attackers]
    D1 --> D2[Declare defenders]
    D2 --> D3[Resolve combat damage]
    D3 --> D4[Apply combat effects]
    
    E --> E1[Discard to hand limit if needed]
    E1 --> E2[Trigger end-of-turn effects]
```

## Combat Resolution

```mermaid
flowchart TD
    A[Combat Phase Begins] --> B[Active player declares attackers]
    B --> C[Defending player declares defenders]
    C --> D[Calculate damage]
    D --> E{Any creatures destroyed?}
    E -->|Yes| F[Move to discard pile]
    E -->|No| G[Apply damage/effects]
    F --> G
    G --> H[Trigger combat abilities]
    H --> I[Combat Phase ends]
```

## Card Resolution Stack

```mermaid
flowchart TD
    A[Player plays card/ability] --> B[Card goes on stack]
    B --> C{Other responses?}
    C -->|Yes| D[Add to stack]
    C -->|No| E[Resolve top of stack]
    D --> C
    E --> F{Stack empty?}
    F -->|No| E
    F -->|Yes| G[Continue game]
```

## Resource Management

```mermaid
flowchart TD
    A[Cards in Hand] --> B[Play Card]
    B --> C{Sufficient Resources?}
    C -->|Yes| D[Pay costs]
    C -->|No| E[Cannot play]
    D --> F[Card enters play]
    F --> G[Trigger enter effects]
    
    H[Resource Generation] --> I[Tap lands/sources]
    I --> J[Add to resource pool]
    J --> K[Use for card costs]
```

## Win Conditions

```mermaid
flowchart TD
    A[Game State Check] --> B{Player at 0 life?}
    B -->|Yes| C[That player loses]
    B -->|No| D{Player cannot draw?}
    D -->|Yes| E[That player loses]
    D -->|No| F{Special win condition?}
    F -->|Yes| G[Check condition]
    F -->|No| H[Game continues]
    G --> I{Condition met?}
    I -->|Yes| J[Player wins]
    I -->|No| H
```

## Ability Activation

```mermaid
flowchart TD
    A[Ability Triggered] --> B{Activation Cost?}
    B -->|Yes| C[Pay cost]
    B -->|No| D[Check conditions]
    C --> E{Cost paid successfully?}
    E -->|Yes| D
    E -->|No| F[Ability fails]
    D --> G{Conditions met?}
    G -->|Yes| H[Ability resolves]
    G -->|No| F
    H --> I[Apply effects]
```
```