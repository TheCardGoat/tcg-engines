# Engine

This folder contains the actual rule engine and the Domain Models (Mobx)

# Testing strategy

- Every card must have tests for their effects (and regression tests, if any)
- Every core concept (Stack, Effect, Condition, Target, Ability, etc...) must have their own tests, these tests MUST assert both happy and non-happy paths, so the card tests don't have to be that extensive

# Don'ts

- Couple anything with React, this folder should be able to run directly on the server and without any UI

# Disclaimer

This project has had more lives than a cat and more resurrections than a zombie apocalypse movie. Abandoned and revived more times than we can count, it has been lovingly (and sometimes not-so-lovingly) coded in those precious short spans of free time that the brave maintainers managed to scrape together. As a result, code consistency and best practices were often given the same priority as a diet during the holidays—something nice to think about, but not always followed.

The logic in this folder, however, has been tested.

# Onboarding

There are two important folders that you need to know about: `cards` and `store`. All the rest is auxiliary code, so you don't have to bother too much.

## Cards

This is where we store the JSON representation of each card, all fields are self explanatory and quite simple to understand. The `abilities` field is that other that does most of the magic and it takes time to understand.
Card ability is responsible for the dynamic of the game, when the engine was initially developed there was no rules whatsoever explanaining how lorcana cards work, so the naming convention was taken from Flesh and Blood [Rules](https://dhhim4ltzu1pj.cloudfront.net/media/documents/FaB_Comprehensive_Rules_v2_8_0_access.pdf), because of that a couple of concepts are a bit forced and don't feel natural. They follow a certain pattern and logic.

Abilities can resolve automatically, or require player action. It's not always that the turn player is the one that has to make the decision, so the engine has to be able to handle that.
Abilities are activated, sometimes passively, sometimes actively, and they will always create a stack layer.
Once a stack layer is created, the engine will resolve it automatically, if there's a need for player action, the engine will pause and wait for the player to make a decision.
Some layers are optional, some are not, some are conditional, some are not. The engine has to be able to handle all of that.
Once the top stack layer is resolved, the engine will execute the abilities effects, in order of declaration. So it's important to declare the effects in the correct order.

That's the gist of it, given the mental model is somewhat inconsistent, we're commenting the types and methods to explain what they do and why they do it.

## Store

Using mobx as a way to model the most important problem in the game, might not be the best decision, but it's the one we have. The store is responsible for keeping track of the game state, and it's the only way to interact with the engine.
But the main concept we should keep in mind is that the store is a reactive model, we try to avoid [anemic models](https://martinfowler.com/bliki/AnemicDomainModel.html) as much as possible, so most of the times the models themselves will have the logic to change the game state, and the store will just be a way to access the game state.
