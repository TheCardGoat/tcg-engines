# @tcg/core-simulator

Svelte package that provides:

- **Lorcana tabletop simulator** – Interactive tabletop (session, fixtures, types) and Lorcana-specific components: `LorcanaTabletopSimulator`, `Card`, `TabletopBoard`, zone components, etc.
- **Shared UI components** – Reusable primitives for card/board UIs: `CardImage`, `cn`, `BoardSurface`, `BoardViewport`, `BoardCard`, `CardSlot`, `UIChrome`, `Zone`, `GameCard`. Note: `Card` in this package is the Lorcana game card; the generic board card is exported as `BoardCard` to avoid a name clash.

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv create --template library --types ts --add playwright paraglide="languageTags:en, es, de, it, pt-BR+demo:yes" storybook mcp="ide:claude-code,cursor,opencode+setup:remote" --install bun core-simulator
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
