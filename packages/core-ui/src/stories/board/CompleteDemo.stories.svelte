<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import BoardViewport from "$lib/components/board/BoardViewport.svelte";

  const { Story } = defineMeta({
    component: BoardViewport,
    parameters: {
      layout: "fullscreen",
    },
    tags: ["autodocs"],
    title: "Board/Complete Demo",
  });
</script>

<script lang="ts">
  import BoardSurface from "$lib/components/board/BoardSurface.svelte";
  import GameCard from "$lib/components/board/GameCard.svelte";
  import UIChrome from "$lib/components/board/UIChrome.svelte";
  import Zone from "$lib/components/board/Zone.svelte";

  const playerLife = 20;
  const opponentLife = 20;

  const playerHand = [
    {
      cost: 3,
      description: "Deals 3 damage to any target.",
      id: 1,
      image:
        "https://images.unsplash.com/photo-1616084403156-9de11a475243?q=80&w=300&auto=format&fit=crop",
      name: "Fireball",
      rarity: "common" as const,
      type: "Spell",
    },
    {
      cost: 1,
      description: "Reach",
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542259681-d26229616cae?q=80&w=300&auto=format&fit=crop",
      name: "Elven Archer",
      power: 1,
      rarity: "uncommon" as const,
      toughness: 1,
      type: "Creature",
    },
    {
      description: "Add G.",
      id: 3,
      image:
        "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=300&auto=format&fit=crop",
      name: "Forest",
      rarity: "common" as const,
      type: "Land",
    },
    {
      cost: 1,
      description: "Target creature gets +3/+3 until end of turn.",
      id: 4,
      image:
        "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=300&auto=format&fit=crop",
      name: "Giant Growth",
      rarity: "common" as const,
      type: "Instant",
    },
    {
      cost: 6,
      description: "Flying",
      id: 5,
      image:
        "https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=300&auto=format&fit=crop",
      name: "Dragon",
      power: 5,
      rarity: "mythic" as const,
      toughness: 5,
      type: "Creature",
    },
  ];

  const playerField = [
    {
      cost: 1,
      id: 101,
      image:
        "https://images.unsplash.com/photo-1599553535948-26155694c038?q=80&w=300&auto=format&fit=crop",
      name: "Soldier",
      power: 1,
      toughness: 1,
      type: "Token",
    },
    {
      cost: 2,
      description: "First Strike",
      id: 102,
      image:
        "https://images.unsplash.com/photo-1598556776374-329437d0422a?q=80&w=300&auto=format&fit=crop",
      name: "Knight",
      power: 2,
      tapped: true,
      toughness: 2,
      type: "Creature",
    },
  ];

  const opponentHand = [1, 2, 3, 4];
  const opponentField = [
    {
      cost: 1,
      id: 201,
      image:
        "https://images.unsplash.com/photo-1610631627885-350e96030c25?q=80&w=300&auto=format&fit=crop",
      name: "Goblin",
      power: 1,
      toughness: 1,
      type: "Creature",
    },
  ];
</script>

<!-- Full TCG Board Demo -->
<Story name="Full Board">
  <BoardViewport background="#0f172a" data-theme="dark">
    <!-- Opponent Info -->
    <UIChrome position="top-left">
      <div
        class="stats shadow bg-base-100/90 backdrop-blur scale-75 origin-top-left"
      >
        <div class="stat">
          <div class="stat-figure text-secondary">
            <div class="avatar online">
              <div class="w-12 rounded-full">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Opponent"
                >
              </div>
            </div>
          </div>
          <div class="stat-title">Opponent</div>
          <div class="stat-value text-secondary">{opponentLife}</div>
          <div class="stat-desc">Cards in hand: {opponentHand.length}</div>
        </div>
      </div>
    </UIChrome>

    <!-- Player Info -->
    <UIChrome position="bottom-right">
      <div
        class="stats shadow bg-base-100/90 backdrop-blur scale-90 origin-bottom-right"
      >
        <div class="stat">
          <div class="stat-figure text-primary">
            <div class="avatar online">
              <div class="w-12 rounded-full">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                  alt="Player"
                >
              </div>
            </div>
          </div>
          <div class="stat-title">You</div>
          <div class="stat-value text-primary">{playerLife}</div>
          <div class="stat-desc">Mana: 5/5</div>
        </div>
      </div>
    </UIChrome>

    <!-- Turn Phase Indicator -->
    <UIChrome position="left-center">
      <ul
        class="steps steps-vertical text-xs opacity-70 bg-base-300/50 p-2 rounded-xl backdrop-blur-sm"
      >
        <li class="step step-primary">Untap</li>
        <li class="step step-primary">Upkeep</li>
        <li class="step step-primary">Draw</li>
        <li class="step step-primary font-bold">Main 1</li>
        <li class="step">Combat</li>
        <li class="step">Main 2</li>
        <li class="step">End</li>
      </ul>
    </UIChrome>

    <!-- Action Bar -->
    <UIChrome position="bottom-center">
      <div class="join shadow-xl mb-4">
        <button class="btn btn-primary join-item">Play Card</button>
        <button class="btn btn-secondary join-item">Attack All</button>
        <button class="btn btn-accent join-item">End Turn</button>
      </div>
    </UIChrome>

    <BoardSurface aspectRatio="16/9" class="bg-base-300 shadow-2xl">
      <!-- Grid Layout for the Table -->
      <div class="w-full h-full grid grid-rows-[1fr_auto_1fr] gap-4 p-6">
        <!-- Opponent Area -->
        <div class="grid grid-cols-[1fr_4fr_1fr] gap-4 items-start">
          <!-- Opponent Deck/Grave -->
          <div class="flex flex-col gap-2 items-center">
            <Zone type="deck" class="w-24 h-32">
              <GameCard name="Back" faceDown hoverable={false} />
            </Zone>
            <div class="badge badge-neutral">Deck: 34</div>
          </div>

          <!-- Opponent Field -->
          <div class="flex flex-col gap-2 h-full">
            <!-- Hand (Upside down or hidden) -->
            <Zone
              type="hand"
              class="justify-center -mb-8 z-10 opacity-80"
              cardSpacing="tight"
            >
              {#each opponentHand as _, i}
                <div class="w-20 h-28 transform rotate-180">
                  <GameCard name="Card Back" faceDown hoverable={false} />
                </div>
              {/each}
            </Zone>

            <!-- Field Rows -->
            <Zone type="field" class="flex-grow items-center justify-center">
              {#each opponentField as card}
                <div class="w-24 h-32 transition-all duration-300">
                  <GameCard
                    name={card.name}
                    cost={card.cost}
                    power={card.power}
                    toughness={card.toughness}
                    type={card.type}
                    image={card.image}
                    class="ring-2 ring-error/50"
                  />
                </div>
              {/each}
            </Zone>
          </div>

          <!-- Opponent Mana/Exile -->
          <div class="flex flex-col gap-2 items-center">
            <Zone type="graveyard" class="w-24 h-32 opacity-50">
              <div
                class="w-full h-full flex items-center justify-center text-xs"
              >
                Graveyard
              </div>
            </Zone>
          </div>
        </div>

        <!-- Center Line / Combat Zone -->
        <div
          class="h-0.5 bg-gradient-to-r from-transparent via-base-content/20 to-transparent w-full"
        ></div>

        <!-- Player Area -->
        <div class="grid grid-cols-[1fr_4fr_1fr] gap-4 items-end">
          <!-- Player Mana/Exile -->
          <div class="flex flex-col gap-2 items-center">
            <Zone type="graveyard" class="w-24 h-32">
              <div
                class="w-full h-full flex items-center justify-center text-xs font-bold text-base-content/50"
              >
                Graveyard (3)
              </div>
            </Zone>
          </div>

          <div class="flex flex-col gap-2 h-full">
            <!-- Field -->
            <Zone type="field" class="flex-grow items-center justify-center">
              {#each playerField as card}
                <div class="w-28 h-40">
                  <GameCard
                    name={card.name}
                    cost={card.cost}
                    power={card.power}
                    toughness={card.toughness}
                    type={card.type}
                    description={card.description}
                    image={card.image}
                    tapped={card.tapped}
                    hoverable
                  />
                </div>
              {/each}
            </Zone>

            <!-- Hand -->
            <Zone type="hand" cardSpacing="overlap" class="pb-2 pt-8 z-20">
              {#each playerHand as card}
                <div
                  class="w-32 h-44 hover:z-30 transition-all duration-200 origin-bottom hover:-translate-y-8"
                >
                  <GameCard
                    name={card.name}
                    cost={card.cost}
                    power={card.power}
                    toughness={card.toughness}
                    type={card.type}
                    description={card.description}
                    image={card.image}
                    rarity={card.rarity}
                    draggable
                    hoverable
                  />
                </div>
              {/each}
            </Zone>
          </div>

          <!-- Player Deck -->
          <div class="flex flex-col gap-2 items-center">
            <Zone
              type="deck"
              class="w-24 h-32 cursor-pointer hover:ring-2 ring-primary"
            >
              <GameCard name="Back" faceDown hoverable={false} />
            </Zone>
            <div class="badge badge-primary">Deck: 42</div>
          </div>
        </div>
      </div>
    </BoardSurface>
  </BoardViewport>
</Story>
