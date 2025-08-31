import { ShoppingList } from '@/types'

export const getListPreview = (list: ShoppingList): string => {
  const visibleItems = list.items.slice(0, 3)
  const itemNames = visibleItems.map(item => item.name).join(', ')
  const remainingCount = list.items.length - visibleItems.length

  if (remainingCount > 0) {
    return `${itemNames} + ${remainingCount} more`
  }

  return itemNames || 'No items'
}

export const getCompletedCount = (list: ShoppingList): number => {
  return list.items.filter(item => item.isCompleted).length
}

export const getDaysInTrash = (deletedAt: Date): number => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - deletedAt.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
