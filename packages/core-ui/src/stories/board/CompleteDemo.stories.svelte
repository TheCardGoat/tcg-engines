<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BoardViewport from "$lib/components/board/BoardViewport.svelte";

  const { Story } = defineMeta({
    title: "Board/Complete Demo",
    component: BoardViewport,
    tags: ["autodocs"],
    parameters: {
      layout: "fullscreen",
    },
  });
</script>

<script>
  import BoardSurface from "$lib/components/board/BoardSurface.svelte";
  import Zone from "$lib/components/board/Zone.svelte";
  import CardSlot from "$lib/components/board/CardSlot.svelte";
  import Card from "$lib/components/board/Card.svelte";
  import UIChrome from "$lib/components/board/UIChrome.svelte";

  const playerLife = 20;
  const opponentLife = 20;

  const playerHand = [1, 2, 3, 4, 5];
  const playerField = [1, 2];
  const opponentField = [1];
  const opponentHand = [1, 2, 3];
</script>

<!-- Full TCG Board Demo -->
<Story name="Full Board">
  <BoardViewport background="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)">
    <UIChrome position="top-left">
      <div class="bg-base-100/90 backdrop-blur shadow-lg rounded-lg p-3">
        <p class="text-xs text-base-content/70">Opponent</p>
        <p class="text-2xl font-bold text-error">{opponentLife}</p>
      </div>
    </UIChrome>

    <UIChrome position="bottom-right">
      <div class="bg-base-100/90 backdrop-blur shadow-lg rounded-lg p-3">
        <p class="text-xs text-base-content/70">Your Life</p>
        <p class="text-2xl font-bold text-success">{playerLife}</p>
      </div>
    </UIChrome>

    <UIChrome position="top-center">
      <div
        class="bg-primary text-primary-content shadow-lg rounded-full px-6 py-2"
      >
        <p class="font-bold text-sm">Your Turn - Main Phase</p>
      </div>
    </UIChrome>

    <UIChrome position="bottom-center">
      <div
        class="bg-base-100/90 backdrop-blur shadow-lg rounded-lg p-2 flex gap-2"
      >
        <button class="btn btn-primary btn-sm">Attack</button>
        <button class="btn btn-secondary btn-sm">Pass Turn</button>
        <button class="btn btn-ghost btn-sm">Settings</button>
      </div>
    </UIChrome>

    <BoardSurface
      aspectRatio="16/9"
      mobileAspectRatio="9/16"
      class="bg-gradient-to-b from-green-900 to-green-950 border-8 border-amber-900 rounded-xl shadow-2xl"
    >
      <div class="w-full h-full grid grid-rows-[1fr_auto_1fr] gap-2 p-4">
        <div class="grid grid-cols-[1fr_3fr_1fr] gap-4">
          <Zone
            type="hand"
            orientation="horizontal"
            cardSpacing="overlap"
            class="bg-black/20 rounded-lg justify-center"
          >
            {#each opponentHand as _, i}
              <div style="width: 50px;">
                <Card faceDown hoverable={false}></Card>
              </div>
            {/each}
          </Zone>

          <Zone
            type="field"
            orientation="horizontal"
            cardSpacing="normal"
            class="bg-black/10 rounded-lg justify-center items-end pb-2"
          >
            {#each opponentField as card, i}
              <div style="width: 70px;">
                <Card>
                  <div
                    class="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold"
                  >
                    {card}
                  </div>
                </Card>
              </div>
            {/each}
          </Zone>

          <div class="flex flex-col gap-2 items-center justify-center">
            <Zone type="deck" class="bg-black/20 rounded-lg">
              <div style="width: 50px;">
                <Card faceDown hoverable={false}></Card>
              </div>
            </Zone>
            <span class="text-white/50 text-xs">Deck: 30</span>
          </div>
        </div>

        <div class="border-t-2 border-dashed border-white/20 my-2"></div>

        <div class="grid grid-cols-[1fr_3fr_1fr] gap-4">
          <div class="flex flex-col gap-2 items-center justify-center">
            <Zone type="deck" class="bg-black/20 rounded-lg">
              <div style="width: 50px;">
                <Card faceDown hoverable={false}></Card>
              </div>
            </Zone>
            <span class="text-white/50 text-xs">Deck: 25</span>
          </div>

          <Zone
            type="field"
            orientation="horizontal"
            cardSpacing="normal"
            class="bg-black/10 rounded-lg justify-center items-start pt-2"
          >
            {#each playerField as card, i}
              <div style="width: 70px;">
                <Card tapped={i === 1}>
                  <div
                    class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold"
                  >
                    {card}
                  </div>
                </Card>
              </div>
            {/each}
          </Zone>

          <Zone
            type="hand"
            orientation="horizontal"
            cardSpacing="overlap"
            class="bg-black/20 rounded-lg justify-center"
          >
            {#each playerHand as card, i}
              <div style="width: 50px;">
                <Card>
                  <div
                    class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {card}
                  </div>
                </Card>
              </div>
            {/each}
          </Zone>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>

<!-- Minimal Board -->
<Story name="Minimal Board">
  <BoardViewport background="#2d3748">
    <BoardSurface
      aspectRatio="4/3"
      class="bg-slate-700 border-4 border-slate-500 rounded-lg"
    >
      <div class="w-full h-full grid grid-rows-3 gap-4 p-6">
        <Zone
          type="hand"
          orientation="horizontal"
          cardSpacing="normal"
          class="justify-center"
        >
          {#each Array(3) as _, i}
            <div style="width: 60px;">
              <Card faceDown></Card>
            </div>
          {/each}
        </Zone>

        <Zone
          type="field"
          orientation="horizontal"
          cardSpacing="normal"
          class="bg-slate-600/50 rounded-lg justify-center items-center"
        >
          <div style="width: 80px;">
            <Card>
              <div
                class="w-full h-full bg-purple-600 flex items-center justify-center text-white"
              >
                Play
              </div>
            </Card>
          </div>
        </Zone>

        <Zone
          type="hand"
          orientation="horizontal"
          cardSpacing="normal"
          class="justify-center"
        >
          {#each Array(5) as _, i}
            <div style="width: 60px;">
              <Card>
                <div
                  class="w-full h-full bg-teal-600 flex items-center justify-center text-white text-sm"
                >
                  {i + 1}
                </div>
              </Card>
            </div>
          {/each}
        </Zone>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>
