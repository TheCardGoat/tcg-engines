# Contributing

Thanks for contributing to the public TCG Online engines repository.

## Scope

Good public contributions include:

- game rules, card behavior, parser tooling, and tests
- shared simulator contracts and adapters
- public simulator UI primitives and developer tooling
- documentation for exported workspaces

Out-of-scope contributions include production web/API services, account systems,
gateway behavior, matchmaking services, deployment configuration, private
observability, and infrastructure.

## Workflow

1. Open an issue or draft PR for behavior changes with broad impact.
2. Keep patches focused to one workspace when possible.
3. Add or update tests for gameplay, parser, adapter, or protocol changes.
4. Run the focused check for the workspace you changed.

The private repository remains canonical for production integration. Accepted
public changes are imported into private and later exported back out during the
weekly public sync.
