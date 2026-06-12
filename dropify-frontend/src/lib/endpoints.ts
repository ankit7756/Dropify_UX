const BASE = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
    REGISTER: `${BASE}/auth/register`,
    LOGIN: `${BASE}/auth/login`,
    PROFILE: `${BASE}/auth/profile`,
    CREATE_DELIVERY: `${BASE}/deliveries`,
    PENDING_DELIVERIES: `${BASE}/deliveries/pending`,
    MY_DELIVERIES: `${BASE}/deliveries/my`,
    DELIVERY_BY_ID: (id: string) => `${BASE}/deliveries/${id}`,
    CANCEL_DELIVERY: (id: string) => `${BASE}/deliveries/${id}/cancel`,
    ACCEPT_DELIVERY: (deliveryId: string) => `${BASE}/orders/accept/${deliveryId}`,
    MARK_PICKUP: (orderId: string) => `${BASE}/orders/${orderId}/pickup`,
    MARK_DELIVERED: (orderId: string) => `${BASE}/orders/${orderId}/deliver`,
    MY_ORDERS: `${BASE}/orders/my`,
    EARNINGS: `${BASE}/orders/earnings`,
    UPDATE_PROFILE: `${BASE}/auth/profile`,
};