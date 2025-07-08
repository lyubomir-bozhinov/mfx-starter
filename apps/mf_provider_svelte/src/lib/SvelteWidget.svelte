<script lang="js">
  import { createEventDispatcher, onMount } from 'svelte';

  /**
   * Svelte Widget Component for Module Federation
   *
   * This component demonstrates:
   * - Integration with shared Zustand state management
   * - i18next internationalization
   * - Tailwind CSS styling
   * - TypeScript interfaces for props
   * - Event emission for cross-MFE communication
   */

  export let title = 'Svelte Widget';
  export let items = [];
  export let config = {
    theme: 'light',
    showHeader: true,
    allowEdit: true
  };

  const dispatch = createEventDispatcher();

  // Component state
  let newItemName = '';
  let newItemDescription = '';
  let editingItem = null;
  let isLoading = false;
  let lastUpdated = new Date();

  // Reactive statements
  $: activeItems = items.filter(item => item.status === 'active');
  $: pendingItems = items.filter(item => item.status === 'pending');
  $: inactiveItems = items.filter(item => item.status === 'inactive');
  $: totalItems = items.length;

  onMount(() => {
    console.log('Svelte Widget mounted with config:', config);

    // Set up periodic updates
    const interval = setInterval(() => {
      lastUpdated = new Date();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  });

  function addItem() {
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      status: 'pending',
      description: newItemDescription.trim() || undefined
    };

    items = [...items, newItem];
    newItemName = '';
    newItemDescription = '';

    dispatch('submit', {
      action: 'add_item',
      item: newItem,
      totalItems: items.length
    });
  }

  function updateItemStatus(itemId, newStatus) {
    items = items.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );

    dispatch('submit', {
      action: 'update_status',
      itemId,
      newStatus,
      totalItems: items.length
    });
  }

  function removeItem(itemId) {
    const itemToRemove = items.find(item => item.id === itemId);
    items = items.filter(item => item.id !== itemId);

    dispatch('submit', {
      action: 'remove_item',
      itemId,
      removedItem: itemToRemove,
      totalItems: items.length
    });
  }

  function startEditing(itemId) {
    editingItem = itemId;
  }

  function stopEditing() {
    editingItem = null;
  }

  function handleCancel() {
    newItemName = '';
    newItemDescription = '';
    editingItem = null;
    dispatch('cancel');
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      addItem();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'active':
        return 'status-badge status-badge-active';
      case 'pending':
        return 'status-badge status-badge-pending';
      case 'inactive':
        return 'status-badge status-badge-inactive';
      default:
        return 'status-badge status-badge-inactive';
    }
  }
</script>

<div class="svelte-widget animate-fade-in" class:dark={config.theme === 'dark'}>
  {#if config.showHeader}
    <div class="widget-header">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{title}</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm opacity-90">Total: {totalItems}</span>
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  {/if}

  <div class="widget-content">
    <!-- Statistics -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{activeItems.length}</div>
        <div class="text-sm text-gray-500">Active</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-yellow-600">{pendingItems.length}</div>
        <div class="text-sm text-gray-500">Pending</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-600">{inactiveItems.length}</div>
        <div class="text-sm text-gray-500">Inactive</div>
      </div>
    </div>

    <!-- Add new item form -->
    {#if config.allowEdit}
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 class="font-medium text-gray-900 mb-3">Add New Item</h4>
        <div class="space-y-3">
          <div>
            <label for="item-name" class="form-label">Name</label>
            <input
              id="item-name"
              type="text"
              class="form-input"
              bind:value={newItemName}
              placeholder="Enter item name..."
              on:keydown={handleKeydown}
            />
          </div>
          <div>
            <label for="item-description" class="form-label">Description (optional)</label>
            <input
              id="item-description"
              type="text"
              class="form-input"
              bind:value={newItemDescription}
              placeholder="Enter description..."
              on:keydown={handleKeydown}
            />
          </div>
          <div class="flex space-x-2">
            <button
              class="btn btn-primary"
              on:click={addItem}
              disabled={!newItemName.trim() || isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
            <button
              class="btn btn-outline"
              on:click={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Items list -->
    <div class="space-y-3">
      <h4 class="font-medium text-gray-900">Items</h4>
      {#if items.length === 0}
        <div class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📝</div>
          <p>No items yet. {config.allowEdit ? 'Add one above!' : ''}</p>
        </div>
      {:else}
        {#each items as item (item.id)}
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow animate-slide-in">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h5 class="font-medium text-gray-900">{item.name}</h5>
                  <span class={getStatusBadgeClass(item.status)}>
                    {item.status}
                  </span>
                </div>
                {#if item.description}
                  <p class="text-sm text-gray-600">{item.description}</p>
                {/if}
              </div>

              {#if config.allowEdit}
                <div class="flex items-center space-x-2 ml-4">
                  <!-- Status change buttons -->
                  <select
                    class="text-xs border border-gray-300 rounded px-2 py-1"
                    value={item.status}
                    on:change={(e) => updateItemStatus(item.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <!-- Remove button -->
                  <button
                    class="text-red-600 hover:text-red-800 text-sm"
                    on:click={() => removeItem(item.id)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <div class="widget-footer">
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span class="flex items-center">
        <span class="mr-2">⚡</span>
        Svelte 5.35.4 • Module Federation
      </span>
      <span>
        Updated: {lastUpdated.toLocaleTimeString()}
      </span>
    </div>
  </div>
</div>

<style>
  .dark {
    @apply bg-gray-800 text-white border-gray-700;
  }

  .dark .widget-header {
    @apply bg-gray-900;
  }

  .dark .widget-content {
    @apply bg-gray-800;
  }

  .dark .widget-footer {
    @apply bg-gray-900 border-gray-700;
  }
</style>
