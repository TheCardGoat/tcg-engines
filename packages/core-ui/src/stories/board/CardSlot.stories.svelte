<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import CardSlot from "$lib/components/board/CardSlot.svelte";

  const { Story } = defineMeta({
    title: "Board/CardSlot",
    component: CardSlot,
    tags: ["autodocs"],
    argTypes: {
      cardAspectRatio: {
        control: { type: "select" },
        options: ["2.5/3.5", "5/7", "63/88", "1/1"],
      },
      empty: { control: "boolean" },
      highlighted: { control: "boolean" },
      droppable: { control: "boolean" },
      index: { control: "number" },
    },
    parameters: {
      layout: "centered",
    },
  });
</script>

<script>
  import Card from "$lib/components/board/Card.svelte";
</script>

<!-- Empty slot -->
<Story name="Empty Slot">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <CardSlot empty></CardSlot>
  </div>
</Story>

<!-- Slot with card -->
<Story name="With Card">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <CardSlot>
      <Card>
        <div
          class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold"
        >
          Card
        </div>
      </Card>
    </CardSlot>
  </div>
</Story>

<!-- Highlighted slot (valid drop target) -->
<Story name="Highlighted">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <CardSlot highlighted empty></CardSlot>
  </div>
</Story>

<!-- Multiple slots in a row -->
<Story name="Multiple Slots">
  <div class="bg-base-300 p-8 flex gap-2" style="width: 500px;">
    {#each Array(5) as _, i}
      <div style="width: 80px;">
        <CardSlot empty={i > 1} index={i}>
          {#if i <= 1}
            <Card>
              <div
                class="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm"
              >
                {i + 1}
              </div>
            </Card>
          {/if}
        </CardSlot>
      </div>
    {/each}
  </div>
</Story>

<!-- Custom empty slot content -->
<Story name="Custom Empty Content">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <CardSlot empty>
      {#snippet emptySlot()}
        <div
          class="w-full h-full rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 flex items-center justify-center"
        >
          <span class="text-primary text-xs">Drop Here</span>
        </div>
      {/snippet}
    </CardSlot>
  </div>
</Story>

<!-- Square aspect ratio -->
<Story name="Square Aspect">
  <div class="bg-base-300 p-8" style="width: 120px;">
    <CardSlot cardAspectRatio="1/1" empty></CardSlot>
  </div>
</Story>
