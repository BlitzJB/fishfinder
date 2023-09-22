import React, { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';

interface Cart<CartItem> {
    products: ({
        item: CartItem,
        removeItem(): void,
        updateQuantity(newQty: number): void,
        quantity: number,
    })[],
    addItem(item: CartItem): void
}

const CartContext = createContext<Cart<any>>({} as Cart<any>);

function useCart<T>(): Cart<T> {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

interface CartProviderProps {
    persistStrategy?: 'localstorage';
}

const CartProvider: React.FC<PropsWithChildren<CartProviderProps>> = ({ children, persistStrategy }) => {
    const [cart, setCart] = useState<any[] | undefined>(undefined);
    
    useEffect(() => {
        if (persistStrategy === 'localstorage') {
            const storedCart = localStorage.getItem('cart');
            if (storedCart !== null) {
                setCart(JSON.parse(storedCart));
            } else {
                setCart([]);
            }
        }
    }, []);
    
    useEffect(() => {
        if (persistStrategy === 'localstorage' && typeof cart !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        if (persistStrategy !== 'localstorage') return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'cart') {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const addItem = (item: any) => {
        if (!cart) {
            setCart([item]);
            return;
        }
        setCart(prevCart => [...prevCart!, item]);
    };
    
    const removeItem = (item: any) => {
        if (!cart) return;
        setCart(prevCart => prevCart!.filter(cartItem => cartItem !== item));
    };
    
    const updateQuantity = (item: any, newQty: number) => {
        if (!cart) return;
        setCart(prevCart => 
            prevCart!.map(cartItem => 
                cartItem === item ? { ...cartItem, quantity: newQty } : cartItem
            )
        );
    };

    const cartValue: Cart<any> = {
        products: (cart || []).map(item => ({
            item,
            removeItem: () => removeItem(item),
            updateQuantity: (newQty: number) => updateQuantity(item, newQty),
            quantity: item.quantity,
        })),
        addItem,
    };

    return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
};
    
export { CartProvider, useCart };
