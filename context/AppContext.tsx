import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useReducer, useEffect } from 'react'

import {
  AppState,
  ShoppingList,
  ShoppingItem,
  CustomItem,
  ItemCategory,
  DEFAULT_CATEGORIES,
  CompletedItemsPosition,
} from '@/types'

type Action =
  | { type: 'SET_ONBOARDING_COMPLETE' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'CREATE_LIST'; payload: { name: string } }
  | { type: 'UPDATE_LIST'; payload: { id: string; name: string } }
  | { type: 'DELETE_LIST'; payload: { id: string } }
  | { type: 'DUPLICATE_LIST'; payload: { id: string } }
  | { type: 'HIDE_LIST'; payload: { id: string } }
  | { type: 'ARCHIVE_LIST'; payload: { id: string } }
  | { type: 'RESTORE_LIST'; payload: { id: string } }
  | { type: 'PERMANENTLY_DELETE_LIST'; payload: { id: string } }
  | {
      type: 'ADD_ITEM'
      payload: { listId: string; name: string; customItemId?: string }
    }
  | {
      type: 'UPDATE_ITEM'
      payload: {
        listId: string
        itemId: string
        updates: Partial<ShoppingItem>
      }
    }
  | { type: 'DELETE_ITEM'; payload: { listId: string; itemId: string } }
  | { type: 'TOGGLE_ITEM'; payload: { listId: string; itemId: string } }
  | {
      type: 'CREATE_CUSTOM_ITEM'
      payload: Omit<CustomItem, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>
    }
  | {
      type: 'UPDATE_CUSTOM_ITEM'
      payload: { id: string; updates: Partial<CustomItem> }
    }
  | { type: 'DELETE_CUSTOM_ITEM'; payload: { id: string } }
  | { type: 'USE_CUSTOM_ITEM'; payload: { id: string } }
  | { type: 'CREATE_CATEGORY'; payload: Omit<ItemCategory, 'id' | 'createdAt'> }
  | {
      type: 'UPDATE_CATEGORY'
      payload: { id: string; updates: Partial<ItemCategory> }
    }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'INITIALIZE_DEFAULT_CATEGORIES' }
  | {
      type: 'SET_COMPLETED_ITEMS_POSITION'
      payload: { position: CompletedItemsPosition }
    }

const initialState: AppState = {
  lists: [],
  customItems: [],
  categories: [],
  hasCompletedOnboarding: false,
  completedItemsPosition: 'bottom', // Default: completed items go to bottom
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, hasCompletedOnboarding: true }

    case 'LOAD_STATE':
      return { ...state, ...action.payload }

    case 'INITIALIZE_DEFAULT_CATEGORIES': {
      if (state.categories.length === 0) {
        const defaultCategories = DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          id: generateId(),
          createdAt: new Date(),
        }))
        return { ...state, categories: defaultCategories }
      }
      return state
    }

    case 'CREATE_LIST': {
      const newList: ShoppingList = {
        id: generateId(),
        name: action.payload.name,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return { ...state, lists: [...state.lists, newList] }
    }

    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, name: action.payload.name, updatedAt: new Date() }
            : list
        ),
      }

    case 'DELETE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? {
                ...list,
                isDeleted: true,
                deletedAt: new Date(),
                updatedAt: new Date(),
              }
            : list
        ),
      }

    case 'ARCHIVE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, isArchived: true, updatedAt: new Date() }
            : list
        ),
      }

    case 'RESTORE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? {
                ...list,
                isDeleted: false,
                isArchived: false,
                deletedAt: undefined,
                updatedAt: new Date(),
              }
            : list
        ),
      }

    case 'PERMANENTLY_DELETE_LIST':
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload.id),
      }

    case 'DUPLICATE_LIST': {
      const originalList = state.lists.find(
        list => list.id === action.payload.id
      )
      if (!originalList) {
        return state
      }

      const duplicatedList: ShoppingList = {
        ...originalList,
        id: generateId(),
        name: `${originalList.name} (Copy)`,
        items: originalList.items.map(item => ({
          ...item,
          id: generateId(),
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return { ...state, lists: [...state.lists, duplicatedList] }
    }

    case 'HIDE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, isHidden: true, updatedAt: new Date() }
            : list
        ),
      }

    case 'ADD_ITEM': {
      let newItem: ShoppingItem

      // If adding from custom item, use its defaults
      if (action.payload.customItemId) {
        const customItem = state.customItems.find(
          item => item.id === action.payload.customItemId
        )
        newItem = {
          id: generateId(),
          name: action.payload.name,
          isCompleted: false,
          url: customItem?.defaultUrl,
          imageUri: customItem?.defaultImageUri,
          category: customItem?.category,
          brand: customItem?.brand,
          notes: customItem?.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        newItem = {
          id: generateId(),
          name: action.payload.name,
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }

      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: [...list.items, newItem],
                updatedAt: new Date(),
              }
            : list
        ),
      }
    }

    case 'UPDATE_ITEM':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === action.payload.itemId
                    ? {
                        ...item,
                        ...action.payload.updates,
                        updatedAt: new Date(),
                      }
                    : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
      }

    case 'DELETE_ITEM':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(
                  item => item.id !== action.payload.itemId
                ),
                updatedAt: new Date(),
              }
            : list
        ),
      }

    case 'TOGGLE_ITEM':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === action.payload.itemId
                    ? {
                        ...item,
                        isCompleted: !item.isCompleted,
                        updatedAt: new Date(),
                      }
                    : item
                ),
                updatedAt: new Date(),
              }
            : list
        ),
      }

    case 'CREATE_CUSTOM_ITEM': {
      const newCustomItem: CustomItem = {
        ...action.payload,
        id: generateId(),
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return {
        ...state,
        customItems: [...state.customItems, newCustomItem],
      }
    }

    case 'UPDATE_CUSTOM_ITEM':
      return {
        ...state,
        customItems: state.customItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates, updatedAt: new Date() }
            : item
        ),
      }

    case 'DELETE_CUSTOM_ITEM':
      return {
        ...state,
        customItems: state.customItems.filter(
          item => item.id !== action.payload.id
        ),
      }

    case 'USE_CUSTOM_ITEM':
      return {
        ...state,
        customItems: state.customItems.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                usageCount: item.usageCount + 1,
                lastUsed: new Date(),
                updatedAt: new Date(),
              }
            : item
        ),
      }

    case 'CREATE_CATEGORY': {
      const newCategory: ItemCategory = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
      }
      return {
        ...state,
        categories: [...state.categories, newCategory],
      }
    }

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.updates }
            : category
        ),
      }

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id !== action.payload.id
        ),
      }

    case 'SET_COMPLETED_ITEMS_POSITION':
      return {
        ...state,
        completedItemsPosition: action.payload.position,
      }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  getList: (id: string) => ShoppingList | undefined
  getVisibleLists: () => ShoppingList[]
  getArchivedLists: () => ShoppingList[]
  getDeletedLists: () => ShoppingList[]
  getCustomItem: (id: string) => CustomItem | undefined
  getCustomItemsByCategory: (categoryId?: string) => CustomItem[]
  getMostUsedCustomItems: (limit?: number) => CustomItem[]
  getCategory: (id: string) => ItemCategory | undefined
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const STORAGE_KEY = '@shopper_app_state'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from AsyncStorage on app start
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEY)
        if (storedState) {
          const parsedState = JSON.parse(storedState)
          // Convert date strings back to Date objects
          const processedState = {
            ...parsedState,
            lists:
              parsedState.lists?.map((list: any) => ({
                ...list,
                createdAt: new Date(list.createdAt),
                updatedAt: new Date(list.updatedAt),
                deletedAt: list.deletedAt
                  ? new Date(list.deletedAt)
                  : undefined,
                items:
                  list.items?.map((item: any) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                  })) || [],
              })) || [],
            customItems:
              parsedState.customItems?.map((item: any) => ({
                ...item,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt),
                lastUsed: item.lastUsed ? new Date(item.lastUsed) : undefined,
              })) || [],
            categories:
              parsedState.categories?.map((category: any) => ({
                ...category,
                createdAt: new Date(category.createdAt),
              })) || [],
          }
          dispatch({ type: 'LOAD_STATE', payload: processedState })
        }
        // Initialize default categories if none exist
        dispatch({ type: 'INITIALIZE_DEFAULT_CATEGORIES' })
      } catch (error) {
        console.error('Failed to load app state:', error)
        // Initialize default categories on error too
        dispatch({ type: 'INITIALIZE_DEFAULT_CATEGORIES' })
      }
    }
    loadState()
  }, [])

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save app state:', error)
      }
    }
    saveState()
  }, [state])

  const getList = (id: string): ShoppingList | undefined => {
    return state.lists.find(list => list.id === id)
  }

  const getVisibleLists = (): ShoppingList[] => {
    return state.lists.filter(
      list => !list.isHidden && !list.isArchived && !list.isDeleted
    )
  }

  const getArchivedLists = (): ShoppingList[] => {
    return state.lists.filter(list => list.isArchived && !list.isDeleted)
  }

  const getDeletedLists = (): ShoppingList[] => {
    return state.lists.filter(list => list.isDeleted)
  }

  const getCustomItem = (id: string): CustomItem | undefined => {
    return state.customItems.find(item => item.id === id)
  }

  const getCustomItemsByCategory = (categoryId?: string): CustomItem[] => {
    if (!categoryId) {
      return state.customItems.filter(item => !item.category)
    }
    const category = state.categories.find(cat => cat.id === categoryId)
    if (!category) {
      return []
    }
    return state.customItems.filter(item => item.category === category.name)
  }

  const getMostUsedCustomItems = (limit = 10): CustomItem[] => {
    return [...state.customItems]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
  }

  const getCategory = (id: string): ItemCategory | undefined => {
    return state.categories.find(category => category.id === id)
  }

  const value: AppContextValue = {
    state,
    dispatch,
    getList,
    getVisibleLists,
    getArchivedLists,
    getDeletedLists,
    getCustomItem,
    getCustomItemsByCategory,
    getMostUsedCustomItems,
    getCategory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
