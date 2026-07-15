<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BoardViewport from "$lib/components/board/BoardViewport.svelte";

  const { Story } = defineMeta({
    component: BoardViewport,
    parameters: {
      layout: "fullscreen",
    },
    tags: ["autodocs"],
    title: "Board/Board States",
  });
</script>

<script lang="ts">
  import BoardSurface from "$lib/components/board/BoardSurface.svelte";
  import Card from "$lib/components/board/Card.svelte";
  import UIChrome from "$lib/components/board/UIChrome.svelte";
  import Zone from "$lib/components/board/Zone.svelte";

  const footerIcons = {
    fullscreen:
      "M7 14H5v5h5v-2H7v-3Zm12 5v-5h-2v3h-3v2h5ZM7 7h3V5H5v5h2V7Zm12 3h2V5h-5v2h3v3Z",
    gear: "M12 8.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 0 0 12 8.75Zm9 3.25-.9-.52.11-1.03-1.63-2.83-1 .4-.83-.62-3.26-.55-.32 1.03h-1.02l-.32-1.03-3.26.55-.83.62-1-.4L2.79 10.45l.11 1.03L2 12l.9.52-.11 1.03 1.63 2.83 1-.4.83.62 3.26.55.32-1.03h1.02l.32 1.03 3.26-.55.83-.62 1 .4 1.63-2.83-.11-1.03.9-.52Z",
    speaker:
      "M5 10v4h3l4 4V2L8 6H5zm11.5 2a4.5 4.5 0 0 1-2 3.75v-7.5a4.5 4.5 0 0 1 2 3.75z",
  };

  const logBlocks = {
    grandArchive: [
      "Player 2 is starting the game!",
      "Shuffling decks...",
      "Player 1 draws 7 cards from Spirit of Water",
      "Player 2 draws 7 cards from Spirit of Water",
      "Turn 1 begins!",
      "Player 2’s Main Phase begins",
      "Player 2 is playing Forging Servant",
      "Opportunity window is open from resolving the effect stack",
    ],
    lorcana: [
      "Player 2 is starting the game!",
      "Shuffling decks...",
      "Drawing starting hands...",
    ],
    runeblood: [
      "Setting player 1 to VisceraI, Rune Blood",
      "Setting player 2 to VisceraI, Rune Blood",
      "Player 1 is starting the game!",
      "Shuffling decks...",
      "Processing start of game actions...",
      "Drawing starting hands...",
      "Round 1 begins!",
    ],
    shields: [
      "Player 1 is starting the game!",
      "Shuffling decks...",
      "Drawing starting hands...",
    ],
    unlimited: [
      "Setting player 1 to Darth Vader, Don’t Fail Me Again",
      "Setting player 2 to Darth Vader, Don’t Fail Me Again",
      "Player 1 is starting the game!",
      "Shuffling decks...",
      "Drawing starting hands...",
    ],
  };

  const makeCounterText = (n: number | string) => String(n);
</script>

<Story name="Lorcana-Style Mulligan">
  <BoardViewport background="#334155" data-theme="dark">
    <UIChrome position="top-left">
      <div
        class="bg-black/80 text-white text-[11px] leading-4 p-3 w-[260px] h-[120px] shadow-lg"
      >
        <ul class="list-disc pl-4 space-y-0.5">
          {#each logBlocks.lorcana as line}
            <li class="opacity-90">{line}</li>
          {/each}
        </ul>
      </div>
    </UIChrome>

    <UIChrome position="bottom-center" zIndex={60}>
      <div
        class="bg-black/85 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-3 text-xs"
      >
        <span class="opacity-95">Which cards to mulligan?</span>
        <button class="btn btn-warning btn-xs">Done</button>
      </div>
    </UIChrome>

    <UIChrome position="bottom-right" zIndex={60}>
      <div class="flex items-center gap-3 text-white/80 text-xs">
        <button class="btn btn-ghost btn-xs px-2" aria-label="Toggle audio">
          <span class="sr-only">Toggle audio</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            aria-label="speaker"
          >
            <path d={footerIcons.speaker} />
          </svg>
        </button>
        <button class="btn btn-ghost btn-xs px-2" aria-label="Open settings">
          <span class="sr-only">Open settings</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            aria-label="settings"
          >
            <path d={footerIcons.gear} />
          </svg>
        </button>
        <div class="px-2 py-1 rounded bg-black/40">1x</div>
        <button
          class="btn btn-ghost btn-xs px-2"
          aria-label="Toggle fullscreen"
        >
          <span class="sr-only">Toggle fullscreen</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            aria-label="fullscreen"
          >
            <path d={footerIcons.fullscreen} />
          </svg>
        </button>
      </div>
    </UIChrome>

    <BoardSurface aspectRatio="16/9" class="bg-slate-600/20">
      <div class="w-full h-full p-6 grid grid-rows-2 gap-6">
        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(148,163,184,0.25),rgba(15,23,42,0.9))]"
          ></div>
          <div
            class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%,rgba(0,0,0,0.35))]"
          ></div>
          <div class="relative h-full p-5 grid grid-cols-[1fr_160px] gap-4">
            <div class="grid grid-rows-3 gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Inkwell
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Items
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Characters / Locations
              </div>
            </div>
            <div class="grid grid-rows-[auto_auto_1fr] gap-3">
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="w-14 h-14 rounded-full border border-white/20 bg-white/5"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(53)}
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl bg-black/70 border border-white/15 p-3 text-white text-center"
              >
                <div class="text-[10px] tracking-widest opacity-80">-Lore-</div>
                <div class="text-3xl font-semibold leading-8">0</div>
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center"
              >
                <div class="text-white/30 text-sm -rotate-90">Discard</div>
              </div>
            </div>
          </div>

          <div
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
          >
            <div class="w-7 h-7 rounded-full bg-white/20"></div>
          </div>

          <div
            class="absolute top-1 left-1/2 -translate-x-1/2 flex gap-2 opacity-95"
          >
            {#each Array.from({ length: 7 }) as _}
              <div class="w-14">
                <Card faceDown hoverable={false} draggable={false}>
                  {#snippet cardBack()}
                    <div
                      class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700"
                    ></div>
                  {/snippet}
                </Card>
              </div>
            {/each}
          </div>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(148,163,184,0.25),rgba(15,23,42,0.9))]"
          ></div>
          <div
            class="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.08),transparent_35%,rgba(0,0,0,0.35))]"
          ></div>
          <div class="relative h-full p-5 grid grid-cols-[1fr_160px] gap-4">
            <div class="grid grid-rows-3 gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Characters / Locations
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Items
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-sm"
              >
                Inkwell
              </div>
            </div>
            <div class="grid grid-rows-[auto_auto_1fr] gap-3">
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="w-14 h-14 rounded-full border border-white/20 bg-white/5"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(53)}
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl bg-black/70 border border-white/15 p-3 text-white text-center"
              >
                <div class="text-[10px] tracking-widest opacity-80">-Lore-</div>
                <div class="text-3xl font-semibold leading-8">0</div>
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center"
              >
                <div class="text-white/30 text-sm -rotate-90">Discard</div>
              </div>
            </div>
          </div>

          <Zone
            type="hand"
            cardSpacing="overlap"
            class="absolute left-1/2 -translate-x-1/2 bottom-0 pb-2 pt-8 z-20"
          >
            {#each Array.from({ length: 7 }) as _}
              <div
                class="w-24 h-32 -mt-6 hover:z-30 transition-all duration-200 origin-bottom hover:-translate-y-6"
              >
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-900"
                  ></div>
                </Card>
              </div>
            {/each}
          </Zone>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<Story name="Rune Blood Action Bar">
  <BoardViewport background="#1f2937" data-theme="dark">
    <UIChrome position="top-left">
      <div
        class="bg-black/80 text-white text-[11px] leading-4 p-3 w-[300px] h-[160px] shadow-lg"
      >
        <ul class="list-disc pl-4 space-y-0.5">
          {#each logBlocks.runeblood as line}
            <li class="opacity-90">{line}</li>
          {/each}
        </ul>
      </div>
    </UIChrome>

    <UIChrome position="bottom-center" zIndex={60}>
      <div
        class="bg-black/85 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-3 text-xs"
      >
        <span class="opacity-95">Play an action or pass to end your turn</span>
        <button class="btn btn-warning btn-xs">Pass</button>
      </div>
    </UIChrome>

    <BoardSurface aspectRatio="16/9" class="bg-slate-700/10">
      <div class="w-full h-full p-6 grid grid-rows-2 gap-6">
        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(168,85,247,0.25),rgba(17,24,39,0.95))]"
          ></div>
          <div class="relative h-full grid grid-cols-[1fr_170px] gap-4 p-5">
            <Zone
              type="field"
              class="relative h-full items-start justify-start gap-4"
            >
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-fuchsia-700 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Bloodrush Stalker
                  </div>
                </Card>
                <div
                  class="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center border border-white/20"
                >
                  0
                </div>
              </div>
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-purple-600 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Viserai
                  </div>
                </Card>
                <div
                  class="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center border border-white/20"
                >
                  1
                </div>
              </div>
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-indigo-600 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Nebula Blade
                  </div>
                </Card>
              </div>
            </Zone>

            <div class="grid grid-rows-[1fr_auto_auto] gap-3 items-end">
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Graveyard
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Banished
              </div>
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center"
                      >
                        <div
                          class="w-14 h-14 rounded border border-white/15 bg-white/5"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-orange-500/30 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(56)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(249,115,22,0.18),rgba(17,24,39,0.95))]"
          ></div>
          <div class="relative h-full grid grid-cols-[1fr_170px] gap-4 p-5">
            <Zone
              type="field"
              class="relative h-full items-start justify-start gap-4"
            >
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-fuchsia-800 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Bloodrush Stalker
                  </div>
                </Card>
                <div
                  class="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center border border-white/20"
                >
                  0
                </div>
              </div>
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-purple-600 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Viserai
                  </div>
                </Card>
                <div
                  class="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center border border-white/20"
                >
                  1
                </div>
              </div>
              <div class="relative w-28 h-40">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-indigo-600 to-slate-950 flex items-center justify-center text-white text-xs font-semibold"
                  >
                    Nebula Blade
                  </div>
                </Card>
              </div>
            </Zone>

            <div class="grid grid-rows-[1fr_auto_auto] gap-3 items-end">
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Graveyard
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Pit
              </div>
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center"
                      >
                        <div
                          class="w-14 h-14 rounded border border-white/15 bg-white/5"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-orange-500/30 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(56)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<Story name="Grand Archive Opportunity (Effect Stack)">
  <BoardViewport background="#334155" data-theme="dark">
    <UIChrome position="top-left">
      <div
        class="bg-black/80 text-white text-[11px] leading-4 p-3 w-[320px] h-[190px] shadow-lg"
      >
        <ul class="list-disc pl-4 space-y-0.5">
          {#each logBlocks.grandArchive as line}
            <li class="opacity-90">{line}</li>
          {/each}
        </ul>
      </div>
    </UIChrome>

    <UIChrome position="top-center" zIndex={60}>
      <div
        class="bg-sky-800/90 border border-sky-200/20 text-white rounded-xl px-5 py-3 shadow-xl min-w-[420px]"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-white/10 border border-white/15"></div>
          <div class="flex-1 text-center font-semibold tracking-wide">
            Effect Stack
          </div>
        </div>
      </div>
    </UIChrome>

    <UIChrome position="bottom-center" zIndex={60}>
      <div
        class="bg-black/85 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-3 text-xs"
      >
        <span class="opacity-95"
          >Which card to play/activate during opportunity? (or pass)</span
        >
        <button class="btn btn-warning btn-xs">Pass</button>
      </div>
    </UIChrome>

    <BoardSurface aspectRatio="16/9" class="bg-slate-600/10">
      <div class="w-full h-full p-6 grid grid-rows-2 gap-6">
        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_55%_40%,rgba(56,189,248,0.15),rgba(15,23,42,0.92))]"
          ></div>
          <div class="relative h-full grid grid-cols-[1fr_170px] gap-4 p-5">
            <Zone type="field" class="h-full items-center justify-center">
              <div class="w-40 h-56">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-sky-300 to-sky-900 flex items-center justify-center text-white font-semibold"
                  >
                    Spirit of Water
                  </div>
                </Card>
              </div>
            </Zone>
            <div class="grid grid-rows-[auto_auto_1fr] gap-3">
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Graveyard
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Banishment
              </div>
              <div class="flex justify-end items-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div class="text-white/70 text-[10px] tracking-widest">
                          GA
                        </div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(53)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_45%_50%,rgba(56,189,248,0.12),rgba(15,23,42,0.92))]"
          ></div>
          <div
            class="relative h-full grid grid-cols-[130px_1fr_170px] gap-4 p-5"
          >
            <div
              class="rounded-xl bg-black/25 border border-white/10 flex items-center justify-center"
            >
              <div class="text-white/30 text-sm -rotate-90">Memory</div>
            </div>
            <Zone type="field" class="h-full items-center justify-center">
              <div class="w-40 h-56">
                <Card hoverable={false} draggable={false}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-sky-300 to-sky-900 flex items-center justify-center text-white font-semibold"
                  >
                    Spirit of Water
                  </div>
                </Card>
              </div>
            </Zone>
            <div class="grid grid-rows-[auto_auto_1fr] gap-3">
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Banishment
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-white/30 text-sm"
              >
                Graveyard
              </div>
              <div class="flex justify-end items-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div class="text-white/70 text-[10px] tracking-widest">
                          GA
                        </div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(53)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute left-6 bottom-5 flex items-center gap-2">
            <div class="relative w-20">
              <Card faceDown hoverable={false} draggable={false}>
                {#snippet cardBack()}
                  <div
                    class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                  >
                    <div class="text-white/70 text-[10px] tracking-widest">
                      RP
                    </div>
                  </div>
                {/snippet}
              </Card>
              <div
                class="absolute -top-2 -right-3 px-2 py-1 rounded-full bg-black/80 border border-white/15 text-white text-xs font-semibold"
              >
                RP 11
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<Story name="Star Wars Unlimited Mulligan Modal">
  <BoardViewport background="#334155" data-theme="dark">
    <UIChrome position="top-left">
      <div
        class="bg-black/80 text-white text-[11px] leading-4 p-3 w-[320px] h-[150px] shadow-lg"
      >
        <ul class="list-disc pl-4 space-y-0.5">
          {#each logBlocks.unlimited as line}
            <li class="opacity-90">{line}</li>
          {/each}
        </ul>
      </div>
    </UIChrome>

    <div
      class="fixed top-0 left-0 right-0 z-[55] flex justify-center pointer-events-none"
    >
      <div class="w-full max-w-[1200px] px-6 pt-2">
        <div class="flex gap-2 justify-center">
          {#each Array.from({ length: 8 }) as _}
            <div
              class="px-4 py-1 rounded bg-sky-700/80 border border-sky-200/20 text-white text-xs tracking-widest"
            >
              UNLIMITED
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="fixed inset-0 z-[65] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50"></div>
      <div
        class="relative bg-black/80 border border-white/15 text-white w-[360px] rounded-xl shadow-2xl p-6"
      >
        <div class="text-center text-sm font-semibold mb-3">Game Setup</div>
        <div class="text-center text-xs opacity-90 mb-5">Take a mulligan?</div>
        <div class="flex gap-3 justify-center">
          <button class="btn btn-sm">Yes</button>
          <button class="btn btn-sm">No</button>
        </div>
      </div>
    </div>

    <BoardSurface aspectRatio="16/9" class="bg-slate-600/10">
      <div class="w-full h-full p-6 grid grid-rows-2 gap-6">
        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(14,165,233,0.12),rgba(15,23,42,0.92))]"
          ></div>
          <div class="relative h-full grid grid-cols-[1fr_1fr_170px] gap-4 p-5">
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
            >
              Space
            </div>
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
            >
              Ground
            </div>
            <div class="grid grid-rows-[auto_1fr] gap-3">
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="text-white/70 text-[9px] tracking-widest text-center"
                        >
                          STAR WARS
                          <br>
                          UNLIMITED
                        </div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(44)}
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center"
              >
                <div class="text-white/30 text-sm -rotate-90">Discard</div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden border border-white/10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_45%_55%,rgba(239,68,68,0.12),rgba(15,23,42,0.92))]"
          ></div>
          <div class="relative h-full grid grid-cols-[1fr_1fr_170px] gap-4 p-5">
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
            >
              Space
            </div>
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
            >
              Ground
            </div>
            <div class="grid grid-rows-[auto_1fr] gap-3">
              <div class="flex justify-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="text-white/70 text-[9px] tracking-widest text-center"
                        >
                          STAR WARS
                          <br>
                          UNLIMITED
                        </div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(44)}
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl bg-black/20 border border-white/10 flex items-center justify-center"
              >
                <div class="text-white/30 text-sm -rotate-90">Discard</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <div
          class="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center"
        >
          <div class="text-white/80 text-[9px] tracking-widest text-center">
            STAR WARS
            <br>
            UNLIMITED
          </div>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<Story name="Minimal Shields Mulligan Modal">
  <BoardViewport background="#334155" data-theme="dark">
    <UIChrome position="top-left">
      <div
        class="bg-black/80 text-white text-[11px] leading-4 p-3 w-[260px] h-[120px] shadow-lg"
      >
        <ul class="list-disc pl-4 space-y-0.5">
          {#each logBlocks.shields as line}
            <li class="opacity-90">{line}</li>
          {/each}
        </ul>
      </div>
    </UIChrome>

    <div class="fixed inset-0 z-[65] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/45"></div>
      <div
        class="relative bg-black/80 border border-white/15 text-white w-[360px] rounded-xl shadow-2xl p-6"
      >
        <div class="text-center text-sm font-semibold mb-3">Game Setup</div>
        <div class="text-center text-xs opacity-90 mb-5">Take a mulligan?</div>
        <div class="flex gap-3 justify-center">
          <button class="btn btn-sm">Yes</button>
          <button class="btn btn-sm">No</button>
        </div>
      </div>
    </div>

    <BoardSurface aspectRatio="16/9" class="bg-slate-600/10">
      <div class="w-full h-full p-6 grid grid-rows-2 gap-6">
        <div
          class="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
        >
          <div
            class="relative h-full grid grid-cols-[120px_1fr_130px] gap-4 p-5"
          >
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2"
            >
              <div class="text-white/35 text-sm">Shield</div>
              <div
                class="w-10 h-10 bg-black/60 border border-white/15 rounded flex items-center justify-center text-white font-semibold"
              >
                10
              </div>
            </div>
            <div class="grid grid-rows-2 gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Resource Area
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Battle Area
              </div>
            </div>
            <div class="grid grid-rows-[auto_1fr] gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Trash
              </div>
              <div class="flex justify-end items-start">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="w-10 h-10 border border-white/20 rotate-45"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(45)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
        >
          <div
            class="relative h-full grid grid-cols-[120px_1fr_130px] gap-4 p-5"
          >
            <div
              class="rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2"
            >
              <div class="text-white/35 text-sm">Shield</div>
              <div
                class="w-10 h-10 bg-black/60 border border-white/15 rounded flex items-center justify-center text-white font-semibold"
              >
                10
              </div>
            </div>
            <div class="grid grid-rows-2 gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Battle Area
              </div>
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Resource Area
              </div>
            </div>
            <div class="grid grid-rows-[auto_1fr] gap-3">
              <div
                class="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/35 text-sm"
              >
                Trash
              </div>
              <div class="flex justify-end items-end">
                <div class="relative w-24">
                  <Card faceDown hoverable={false} draggable={false}>
                    {#snippet cardBack()}
                      <div
                        class="w-full h-full bg-gradient-to-br from-slate-950 to-slate-700 flex items-center justify-center"
                      >
                        <div
                          class="w-10 h-10 border border-white/20 rotate-45"
                        ></div>
                      </div>
                    {/snippet}
                  </Card>
                  <div
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {makeCounterText(45)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-3"
          >
            <div class="w-28 h-40">
              <Card hoverable={false} draggable={false}>
                <div
                  class="w-full h-full bg-gradient-to-br from-sky-200 to-sky-500 flex flex-col justify-between p-2 text-slate-900"
                >
                  <div class="text-[10px] font-semibold">EX-BASE</div>
                  <div class="text-[10px] self-end">0</div>
                </div>
              </Card>
            </div>
            <div class="w-28 h-40">
              <Card hoverable={false} draggable={false}>
                <div
                  class="w-full h-full bg-gradient-to-br from-sky-200 to-sky-500 flex flex-col justify-between p-2 text-slate-900"
                >
                  <div class="text-[10px] font-semibold">EX-BASE</div>
                  <div class="text-[10px] self-end">0</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>
