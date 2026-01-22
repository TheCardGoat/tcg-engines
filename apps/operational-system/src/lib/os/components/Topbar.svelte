<script lang="ts">
  import { tick } from "svelte";
  import { os } from "../os.svelte";

  type MenuItem =
    | { type: "link"; label: string; action: () => void; rightLabel?: string }
    | { type: "submenu"; label: string; items: MenuItem[] };

  type Menu = { id: string; label: string; items: MenuItem[] };

  let openMenuId = $state<string | null>(null);
  let openSubmenuLabel = $state<string | null>(null);

  function toggleMenu(id: string) {
    openMenuId = openMenuId === id ? null : id;
    openSubmenuLabel = null;
  }

  function closeMenus() {
    openMenuId = null;
    openSubmenuLabel = null;
  }

  function openCommandCenter() {
    os.isCommandCenterOpen = true;
    closeMenus();
  }

  function openRightPanel() {
    os.isRightPanelOpen = true;
    closeMenus();
  }

  function launchApp(appId: string) {
    os.openWindow(appId);
    closeMenus();
  }

  function openMenuSubmenu(label: string) {
    openSubmenuLabel = openSubmenuLabel === label ? null : label;
  }

  function onBackdropClick() {
    closeMenus();
  }

  function onWindowTabClick(id: string) {
    const win = os.windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      os.focusWindow(id);
      return;
    }

    if (os.activeWindowId === id) {
      os.minimizeWindow(id);
      return;
    }

    os.focusWindow(id);
  }

  let activeTabElement = $state<HTMLElement | null>(null);

  const activeWindowId = $derived.by(() => {
    if (os.activeWindowId) return os.activeWindowId;
    const candidates = os.windows.slice().sort((a, b) => b.zIndex - a.zIndex);
    return candidates[0]?.id ?? null;
  });

  function activeTab(node: HTMLElement, isActive: boolean) {
    if (isActive) activeTabElement = node;
    return {
      update(next: boolean) {
        if (next) activeTabElement = node;
      },
    };
  }

  $effect(() => {
    if (!activeWindowId) return;
    tick().then(() => {
      activeTabElement?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  });

  const menus = $derived<Menu[]>([
    {
      id: "product-os",
      label: "Product OS",
      items: [
        {
          type: "submenu",
          label: "Browse all apps",
          items: os.desktopIcons.map((a) => ({
            type: "link",
            label: `${a.icon} ${a.title}`,
            action: () => launchApp(a.id),
          })),
        },
        {
          type: "link",
          label: "Search apps",
          action: openCommandCenter,
          rightLabel: "⌘K",
        },
      ],
    },
    {
      id: "docs",
      label: "Docs",
      items: [
        { type: "link", label: "Getting started", action: closeMenus },
        { type: "link", label: "Keyboard shortcuts", action: closeMenus },
      ],
    },
    {
      id: "community",
      label: "Community",
      items: [
        { type: "link", label: "Changelog", action: closeMenus },
        { type: "link", label: "Ask a question", action: closeMenus },
      ],
    },
    {
      id: "company",
      label: "Company",
      items: [
        { type: "link", label: "About", action: closeMenus },
        { type: "link", label: "Work here", action: closeMenus },
      ],
    },
    {
      id: "more",
      label: "More",
      items: [
        { type: "link", label: "Active windows", action: openRightPanel },
      ],
    },
  ]);
</script>

<div
  class="fixed top-0 left-0 right-0 h-12 bg-[#efe7d6]/90 backdrop-blur-md border-b border-black/10 z-[10000]"
  role="navigation"
  aria-label="Topbar"
>
  <div class="h-full px-3 flex items-center gap-3">
    <div class="flex items-center gap-1 shrink-0">
      <button
        class="h-9 px-2 rounded-md hover:bg-black/5 transition-colors text-sm font-semibold"
        onclick={() => toggleMenu("product-os")}
        aria-haspopup="menu"
        aria-expanded={openMenuId === "product-os"}
      >
        Product OS
      </button>

      {#each menus.filter((m) => m.id !== 'product-os') as menu (menu.id)}
        <button
          class="h-9 px-2 rounded-md hover:bg-black/5 transition-colors text-sm font-semibold"
          onclick={() => toggleMenu(menu.id)}
          aria-haspopup="menu"
          aria-expanded={openMenuId === menu.id}
        >
          {menu.label}
        </button>
      {/each}
    </div>

    {#if os.windows.length > 0}
      <div class="flex-1 min-w-0 overflow-x-auto">
        <div class="h-full flex items-center gap-1">
          {#each os.windows as win (win.id)}
            {#if win.id === activeWindowId}
              <div class="relative shrink-0" use:activeTab={true}>
                <button
                  class="h-9 px-3 pr-8 rounded-xl border border-black/20 bg-white flex items-center gap-2 max-w-[240px]"
                  onclick={() => onWindowTabClick(win.id)}
                  aria-label={win.title}
                >
                  <span
                    class={"text-base " + (win.isMinimized ? "opacity-50" : "opacity-90")}
                    >{win.icon}</span
                  >
                  <span
                    class={"text-xs font-semibold truncate " +
                      (win.isMinimized ? "text-black/40" : "text-black/70")}
                    >{win.title}</span
                  >
                </button>

                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-md hover:bg-black/10 transition-colors"
                  aria-label="Close"
                  onclick={(e) => {
                    e.stopPropagation();
                    os.closeWindow(win.id);
                  }}
                >
                  <span class="text-sm text-black/60">×</span>
                </button>
              </div>
            {:else}
              <button
                class={"h-9 w-9 rounded-xl border transition-colors grid place-items-center shrink-0 bg-black/5 hover:bg-black/10 border-black/10"}
                onclick={() => onWindowTabClick(win.id)}
                aria-label={win.title}
                title={win.title}
              >
                <span
                  class={"text-base " + (win.isMinimized ? "opacity-50" : "opacity-90")}
                  >{win.icon}</span
                >
              </button>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <div class="flex-1"></div>
    {/if}

    <div class="flex items-center gap-2 shrink-0">
      <button
        class="h-9 px-3 rounded-full bg-[#f59e0b] text-black text-sm font-semibold hover:bg-[#f59e0b]/90 transition-colors"
        onclick={() => launchApp("hello")}
      >
        Get started – free
      </button>

      <button
        class="h-9 w-9 grid place-items-center rounded-md hover:bg-black/5 transition-colors"
        aria-label="Open Command Center"
        onclick={openCommandCenter}
      >
        <span class="text-lg">⌕</span>
      </button>

      <button
        class="h-9 w-9 grid place-items-center rounded-md hover:bg-black/5 transition-colors"
        aria-label="Open Notifications"
        onclick={openRightPanel}
      >
        <span class="text-lg">🔔</span>
      </button>
    </div>
  </div>

  {#if openMenuId}
    <button
      class="fixed inset-0 bg-transparent z-[9999]"
      onclick={onBackdropClick}
      aria-label="Close menus"
    ></button>

    {#each menus.filter((m) => m.id === openMenuId) as active (active.id)}
      <div
        class="absolute top-12 left-3 w-[320px] bg-white rounded-xl shadow-2xl border border-black/10 overflow-hidden z-[10001]"
        role="menu"
        aria-label={active.label}
      >
        <div class="px-4 py-3 border-b border-black/10">
          <div class="text-sm font-semibold text-black/80">{active.label}</div>
        </div>

        <div class="p-2">
          {#each active.items as item}
            {#if item.type === 'link'}
              <button
                class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-left"
                role="menuitem"
                onclick={() => item.action()}
              >
                <span class="text-sm font-medium text-black/80 truncate"
                  >{item.label}</span
                >
                {#if item.rightLabel}
                  <span class="text-xs text-black/50">{item.rightLabel}</span>
                {/if}
              </button>
            {:else}
              <div class="relative">
                <button
                  class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-left"
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={openSubmenuLabel === item.label}
                  onclick={() => openMenuSubmenu(item.label)}
                >
                  <span class="text-sm font-medium text-black/80 truncate"
                    >{item.label}</span
                  >
                  <span class="text-black/40">›</span>
                </button>

                {#if openSubmenuLabel === item.label}
                  <div
                    class="absolute top-0 left-full ml-2 w-[320px] bg-white rounded-xl shadow-2xl border border-black/10 overflow-hidden"
                    role="menu"
                    aria-label={item.label}
                  >
                    <div class="px-4 py-3 border-b border-black/10">
                      <div class="text-sm font-semibold text-black/80">
                        {item.label}
                      </div>
                    </div>
                    <div class="p-2 max-h-[60vh] overflow-auto">
                      {#each item.items as sub}
                        {#if sub.type === 'link'}
                          <button
                            class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-left"
                            role="menuitem"
                            onclick={() => sub.action()}
                          >
                            <span
                              class="text-sm font-medium text-black/80 truncate"
                              >{sub.label}</span
                            >
                            {#if sub.rightLabel}
                              <span class="text-xs text-black/50"
                                >{sub.rightLabel}</span
                              >
                            {/if}
                          </button>
                        {/if}
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") closeMenus();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandCenter();
    }
  }}
/>
