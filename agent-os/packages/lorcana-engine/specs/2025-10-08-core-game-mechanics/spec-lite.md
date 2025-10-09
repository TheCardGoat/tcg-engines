# Spec Summary (Lite)

Implement fundamental Disney Lorcana game mechanics including complete three-phase turn structure (Beginning/Main/End), five core moves (Play Card, Quest, Challenge, Ink Card, Pass Turn), zone management system (Deck/Hand/Play/Discard/Inkwell), game setup with mulligan, triggered ability resolution through "the bag" priority queue, and win/loss condition detection. This establishes a fully playable engine that progresses from game initialization through complete turn cycles to game end, with all state changes immutable, deterministic, and type-safe using the @tcg/core framework.

