# Lorcana Engine

This repository contains the code for a Svelte library that provides a Lorcana simulator, A game engine for the Lorcana TCG, and a Card Library for the Lorcana TCG.
The project is a work in progress, and is not yet ready for production.

# Disclaimer

Read [DISCLAIMER.md](./DISCLAIMER.md) for more information.

This project is an unofficial, non-commercial open-source implementation of
gameplay mechanics inspired by Disney Lorcana TCG. It is not affiliated with, endorsed by, or sponsored by Disney or Ravensburger.

All trademarks and copyrighted material belong to their respective owners. Our use of Disney-related trademarks and intellectual property is solely for non-commercial, educational, or entertainment purposes, in line with fair use and nominative use laws.

We comply with [Ravensburger's Fan Content Policy](https://brand.ravensburger-group.com/d/e1vhRSQ7WeNy/overview#/policies/fan-content) and [Ravensburger’s Community Code Policy](https://cdn.ravensburger.com/lorcana/community-code-en).

## Getting Started

You can use [setup.sh](./setup.sh) to set up the project, we're using [Vite Plus](https://viteplus.dev/) as our toolchain, and [Bun](https://bun.com/) as our runtime

```bash
vp install
vp run dev
```

## Creating your own Bot strategy

All Bot automations live under `packages/lorcana/lorcana-engine/src/automation`, you can use the [Sample Prompt](packages/lorcana/lorcana-engine/src/automation/REFINEMENT_PROMPT.md) to use an AI agent of choice (Claude code, Codex, Opencode) to create a Bot.
