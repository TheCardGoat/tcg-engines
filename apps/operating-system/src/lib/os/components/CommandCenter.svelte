<script lang="ts">
    import { os } from '../os.svelte';
    import { fade, scale } from 'svelte/transition';
    import { tick } from 'svelte';

    let searchQuery = $state('');
    let searchInput = $state<HTMLInputElement | null>(null);

    $effect(() => {
        if (!os.isCommandCenterOpen) return;
        tick().then(() => {
            searchInput?.focus();
        });
    });

    let filteredApps = $derived(
        os.desktopIcons.filter(app => 
            app.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    function launchApp(id: string) {
        os.openWindow(id);
        os.isCommandCenterOpen = false;
        searchQuery = '';
    }
</script>

{#if os.isCommandCenterOpen}
    <!-- Backdrop -->
    <button 
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
        onclick={() => os.isCommandCenterOpen = false}
        transition:fade={{ duration: 150 }}
        aria-label="Close Command Center"
    ></button>

    <!-- Command Center -->
    <div 
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999] flex flex-col max-h-[80vh]"
        transition:scale={{ duration: 200, start: 0.95 }}
        role="dialog"
        aria-label="Command Center"
        aria-modal="true"
    >
        <!-- Search -->
        <div class="p-4 border-b border-gray-100">
            <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                    type="text" 
                    placeholder="Search apps..." 
                    class="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    bind:value={searchQuery}
                    bind:this={searchInput}
                />
            </div>
        </div>

        <!-- App Grid -->
        <div class="p-4 overflow-y-auto">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Applications</h3>
            
            <div class="grid grid-cols-4 gap-4">
                {#each filteredApps as app (app.id)}
                    <button 
                        class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        onclick={() => launchApp(app.id)}
                    >
                        <div class="w-12 h-12 flex items-center justify-center text-3xl bg-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                            {app.icon}
                        </div>
                        <span class="text-xs font-medium text-gray-700 text-center">{app.title}</span>
                    </button>
                {/each}
            </div>
            
            {#if filteredApps.length === 0}
                <div class="text-center py-8 text-gray-500">
                    No apps found matching "{searchQuery}"
                </div>
            {/if}
        </div>
        
        <!-- Footer -->
        <div class="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>Operational System v0.1</span>
            <span>{os.windows.length} active windows</span>
        </div>
    </div>
{/if}
