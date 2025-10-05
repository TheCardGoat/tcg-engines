# Spec Summary (Lite)

Enhance the Core TCG Engine's targeting system by extending `BaseCoreCardFilter` with rich, serializable JSON filtering capabilities (status, attributes, keywords, characteristics), implementing a `TargetResolver` for runtime filter evaluation with automatic security checks (Ward, protection abilities), and providing a `TargetValidator` with clear APIs for potential targets and validation. Optional builder pattern available for programmatic construction, but all target definitions remain plain JSON for deterministic replay and network transmission.

