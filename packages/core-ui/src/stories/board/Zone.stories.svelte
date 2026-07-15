<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Zone from "$lib/components/board/Zone.svelte";

  const { Story } = defineMeta({
    argTypes: {
      type: {
        control: { type: "select" },
        options: [
          "hand",
          "field",
          "deck",
          "graveyard",
          "resource",
          "exile",
          "custom",
        ],
      },
      orientation: {
        control: { type: "select" },
        options: ["horizontal", "vertical"],
      },
      cardSpacing: {
        control: { type: "select" },
        options: ["none", "tight", "normal", "loose", "overlap"],
      },
      maxCards: { control: "number" },
      droppable: { control: "boolean" },
      dropHighlight: { control: "boolean" },
    },
    component: Zone,
    parameters: {
      layout: "centered",
    },
    tags: ["autodocs"],
    title: "Board/Zone",
  });
</script>

<script>
  import Card from "$lib/components/board/Card.svelte";
</script>

<!-- Hand zone with horizontal cards -->
<Story name="Hand Zone">
  <div class="bg-base-300 p-8" style="width: 600px;">
    <Zone
      type="hand"
      orientation="horizontal"
      cardSpacing="normal"
      class="bg-base-200"
    >
      {#each Array(5) as _, i}
        <div style="width: 80px;">
          <Card>
            <div
              class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold"
            >
              {i + 1}
            </div>
          </Card>
        </div>
      {/each}
    </Zone>
  </div>
</Story>

<!-- Field zone -->
<Story name="Field Zone">
  <div class="bg-base-300 p-8" style="width: 600px;">
    <Zone
      type="field"
      orientation="horizontal"
      cardSpacing="normal"
      class="bg-green-900/30 min-h-32"
    >
      {#each Array(3) as _, i}
        <div style="width: 80px;">
          <Card>
            <div
              class="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold"
            >
              {i + 1}
            </div>
          </Card>
        </div>
      {/each}
    </Zone>
  </div>
</Story>

<!-- Deck zone (vertical stack) -->
<Story name="Deck Zone">
  <div class="bg-base-300 p-8" style="width: 200px;">
    <Zone
      type="deck"
      orientation="vertical"
      cardSpacing="overlap"
      class="bg-amber-900/30"
    >
      {#each Array(3) as _, i}
        <div style="width: 80px;">
          <Card faceDown hoverable={false}>
            <div
              class="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800"
            ></div>
          </Card>
        </div>
      {/each}
    </Zone>
  </div>
</Story>

<!-- Overlapping cards (like a hand fan) -->
<Story name="Overlapping Cards">
  <div class="bg-base-300 p-8" style="width: 400px;">
    <Zone
      type="hand"
      orientation="horizontal"
      cardSpacing="overlap"
      class="bg-base-200"
    >
      {#each Array(7) as _, i}
        <div style="width: 80px;">
          <Card>
            <div
              class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold"
            >
              {i + 1}
            </div>
          </Card>
        </div>
      {/each}
    </Zone>
  </div>
</Story>

<!-- Drop highlight state -->
<Story name="Drop Highlight">
  <div class="bg-base-300 p-8" style="width: 600px;">
    <Zone
      type="field"
      orientation="horizontal"
      cardSpacing="normal"
      dropHighlight
      droppable
      class="bg-green-900/30 min-h-32"
    >
      <div style="width: 80px;">
        <Card>
          <div
            class="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold"
          >
            1
          </div>
        </Card>
      </div>
    </Zone>
  </div>
</Story>

<!-- Empty zone -->
<Story name="Empty Zone">
  <div class="bg-base-300 p-8" style="width: 600px;">
    <Zone
      type="field"
      orientation="horizontal"
      class="bg-green-900/30 min-h-32"
    >
      <span class="text-base-content/50 text-sm">No cards in play</span>
    </Zone>
  </div>
</Story>
