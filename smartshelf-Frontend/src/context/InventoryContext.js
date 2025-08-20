import React, { createContext, useContext, useState, useReducer } from 'react';

// Create context
const InventoryContext = createContext();

// Action types
const ACTIONS = {
  UPDATE_STOCK: 'UPDATE_STOCK',
  PLACE_ORDER: 'PLACE_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  ADD_STOCK_HISTORY: 'ADD_STOCK_HISTORY'
};

// Initial state
const initialState = {
  stockItems: [
    {
      id: 1,
      name: "Chicken Biryani",
      category: "Meal",
      quantity: 50,
      unit: "plates",
      reorderLevel: 20,
      lastUpdated: "2025-08-19"
    },
    {
      id: 2,
      name: "Lays Chips",
      category: "Snack",
      quantity: 15,
      unit: "packets",
      reorderLevel: 30,
      lastUpdated: "2025-08-19"
    },
    {
      id: 3,
      name: "Coca Cola",
      category: "Drink",
      quantity: 100,
      unit: "bottles",
      reorderLevel: 40,
      lastUpdated: "2025-08-19"
    }
  ],
  orders: [],
  stockHistory: []
};

// Reducer function
function inventoryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_STOCK:
      return {
        ...state,
        stockItems: state.stockItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload, lastUpdated: new Date().toISOString().split('T')[0] }
            : item
        )
      };

    case ACTIONS.PLACE_ORDER:
      const newOrder = {
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      // Create stock history entries for each item in the order
      const historyEntries = action.payload.items.map(item => ({
        id: Date.now() + Math.random(),
        date: new Date().toISOString().split('T')[0],
        orderId: newOrder.id,
        itemId: item.id,
        itemName: item.name,
        quantity: -item.quantity,
        type: 'order',
        description: `Order #${newOrder.id}`
      }));

      return {
        ...state,
        orders: [...state.orders, newOrder],
        stockHistory: [...state.stockHistory, ...historyEntries]
      };

    case ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };

    case ACTIONS.ADD_STOCK_HISTORY:
      return {
        ...state,
        stockHistory: [...state.stockHistory, {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          ...action.payload
        }]
      };

    default:
      return state;
  }
}

// Provider component
export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Helper function to check stock availability
  const checkStockAvailability = (items) => {
    const unavailableItems = [];
    items.forEach(orderItem => {
      const stockItem = state.stockItems.find(item => item.id === orderItem.id);
      if (!stockItem || stockItem.quantity < orderItem.quantity) {
        unavailableItems.push({
          name: stockItem ? stockItem.name : orderItem.name,
          available: stockItem ? stockItem.quantity : 0,
          requested: orderItem.quantity
        });
      }
    });
    return unavailableItems;
  };

  // Helper function to update stock quantities
  const updateStockQuantities = (items) => {
    items.forEach(orderItem => {
      const stockItem = state.stockItems.find(item => item.id === orderItem.id);
      if (stockItem) {
        dispatch({
          type: ACTIONS.UPDATE_STOCK,
          payload: {
            ...stockItem,
            quantity: stockItem.quantity - orderItem.quantity
          }
        });
      }
    });
  };

  // Function to place an order
  const placeOrder = (orderData) => {
    const unavailableItems = checkStockAvailability(orderData.items);
    
    if (unavailableItems.length > 0) {
      throw new Error(
        'Not enough stock for the following items:\n' +
        unavailableItems.map(item => 
          `${item.name} (only ${item.available} available, ${item.requested} requested)`
        ).join('\n')
      );
    }

    // If stock is available, place the order and update quantities
    dispatch({ type: ACTIONS.PLACE_ORDER, payload: orderData });
    updateStockQuantities(orderData.items);
  };

  const value = {
    stockItems: state.stockItems,
    orders: state.orders,
    stockHistory: state.stockHistory,
    dispatch,
    placeOrder,
    checkStockAvailability
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

// Custom hook to use the inventory context
export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
