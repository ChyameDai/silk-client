export const environment = {
  production: false,
  apiBaseUrl: 'https://automation-619630888.us-east-2.elb.amazonaws.com:8080/silk',

  // Authentication endpoints
  auth: {
    login: '/api/v1/user/get-user-by-email/',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
  },

  // User related endpoints
  user: {
    profile: '/api/users/profile',
    updateProfile: '/api/users/update',
    changePassword: '/api/users/change-password',
  },

  // Product related endpoints
  products: {
    list: '/api/v1/user/products/Test Store 3',
    details: '/api/v1/user/store-products/details/', // ":id" will be dynamically replaced with the product ID
    search: '/api/products/search',
    categories: '/api/products/categories',
    featured: '/api/products/featured',
  },

  // Cart related endpoints
  cart: {
    get: '/api/v1/user/get-all-my-cart/',
    add: '/api/v1/user/add/products-to-cart/v2',
    update: '/api/v1/user/update/cart-item/v2',
    remove: '/api/cart/remove',
    clear: '/api/cart/clear',
  },

  // Order related endpoints
  orders: {
    checkout: '/api/v1/user/checkout',
    list: '/api/orders',
    details: '/api/orders/:id', // ":id" will be dynamically replaced with the order ID
    cancel: '/api/orders/:id/cancel', // ":id" will be dynamically replaced with the order ID
    history: '/api/orders/history',
    allShippingAddresses: '/api/v1/user/get-all-shipping-addresses/',
    defaultShippingAddress: '/api/v1/user/add-shipping-address/',
    addShippingAddress: '/api/orders/add-shipping-address',
  },

  // Payment related endpoints
  payment: {
    process: '/api/payment/process',
    verify: '/api/payment/verify',
    methods: '/api/payment/methods',
  },

  // Review & Rating endpoints
  reviews: {
    create: '/api/reviews/create',
    list: '/api/reviews/product/:id', // ":id" will be dynamically replaced with the product ID
    userReviews: '/api/reviews/user',
  },

  // Wishlist endpoints
  wishlist: {
    get: '/api/wishlist',
    add: '/api/wishlist/add',
    remove: '/api/wishlist/remove',
  },

  // Notification endpoints
  notifications: {
    list: '/api/notifications',
    markRead: '/api/notifications/mark-read',
    settings: '/api/notifications/settings',
  },

  // Address management endpoints
  address: {
    list: '/api/addresses',
    add: '/api/addresses/add',
    update: '/api/addresses/update',
    delete: '/api/addresses/delete',
    setDefault: '/api/addresses/set-default',
  },

  // API response timeouts
  timeouts: {
    default: 30000, // 30 seconds
    upload: 120000, // 2 minutes for uploads
    download: 300000, // 5 minutes for downloads
  },

  // Feature flags
  features: {
    enableReviews: true,
    enableWishlist: true,
    enableNotifications: true,
    enableGuestCheckout: true,
    enableSocialLogin: true,
  },

  // Social login configurations
  socialLogin: {
    google: {
      clientId: 'your-google-client-id',
      scope: 'email profile',
    },
    facebook: {
      appId: 'your-facebook-app-id',
      scope: 'email,public_profile',
    },
  },

  // Storage keys
  storage: {
    authToken: 'auth_token',
    refreshToken: 'refresh_token',
    user: 'user_data',
    cart: 'cart_items',
    theme: 'app_theme',
    language: 'app_language',
  },

  // API versioning
  apiVersion: 'v1',

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },

  // Image upload configurations
  upload: {
    maxSize: 5242880, // 5MB in bytes
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: {
      product: {
        width: 800,
        height: 800,
      },
      avatar: {
        width: 200,
        height: 200,
      },
    },
  },
};
