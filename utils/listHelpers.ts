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

export const getRelativeTime = (deletedAt: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - deletedAt.getTime())

  // Convert to different units
  const seconds = Math.floor(diffTime / 1000)
  const minutes = Math.floor(diffTime / (1000 * 60))
  const hours = Math.floor(diffTime / (1000 * 60 * 60))
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (days >= 1) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours >= 1) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes >= 1) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
  }
}

// Keep the old function for backward compatibility, but now using getRelativeTime
export const getDaysInTrash = (deletedAt: Date): number => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - deletedAt.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
