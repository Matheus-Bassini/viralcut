import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentAPI from '../../services/api/paymentAPI';

const initialState = {
  subscriptionPlans: [],
  currentSubscription: null,
  paymentMethods: [],
  invoices: [],
  paymentHistory: [],
  isLoading: false,
  error: null,
  checkoutSession: null,
  discounts: {
    available: [],
    applied: null,
  },
};

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  'payment/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getSubscriptionPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

export const fetchCurrentSubscription = createAsyncThunk(
  'payment/fetchCurrentSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getCurrentSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async ({ planId, billingCycle, discountCode }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createCheckoutSession({
        planId,
        billingCycle,
        discountCode,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create checkout session');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async ({ sessionId, paymentIntentId }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.confirmPayment({
        sessionId,
        paymentIntentId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment confirmation failed');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'payment/cancelSubscription',
  async ({ reason, feedback }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.cancelSubscription({
        reason,
        feedback,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

export const resumeSubscription = createAsyncThunk(
  'payment/resumeSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.resumeSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resume subscription');
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'payment/updateSubscription',
  async ({ planId, billingCycle }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.updateSubscription({
        planId,
        billingCycle,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subscription');
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentMethods();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'payment/addPaymentMethod',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.addPaymentMethod(paymentMethodData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment method');
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  'payment/removePaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      await paymentAPI.removePaymentMethod(paymentMethodId);
      return paymentMethodId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove payment method');
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'payment/setDefaultPaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.setDefaultPaymentMethod(paymentMethodId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default payment method');
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  'payment/fetchInvoices',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getInvoices({ page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'payment/downloadInvoice',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.downloadInvoice(invoiceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download invoice');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchPaymentHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentHistory({ page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
);

export const validateDiscountCode = createAsyncThunk(
  'payment/validateDiscountCode',
  async ({ code, planId }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.validateDiscountCode({ code, planId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid discount code');
    }
  }
);

export const fetchAvailableDiscounts = createAsyncThunk(
  'payment/fetchAvailableDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getAvailableDiscounts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch discounts');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCheckoutSession: (state) => {
      state.checkoutSession = null;
    },
    setAppliedDiscount: (state, action) => {
      state.discounts.applied = action.payload;
    },
    clearAppliedDiscount: (state) => {
      state.discounts.applied = null;
    },
    updateSubscriptionStatus: (state, action) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = action.payload;
      }
    },
    resetPaymentState: (state) => {
      return {
        ...initialState,
        subscriptionPlans: state.subscriptionPlans, // Keep plans cached
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription Plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionPlans = action.payload.plans;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Current Subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload.subscription;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Checkout Session
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkoutSession = action.payload.session;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload.subscription;
        state.checkoutSession = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload.subscription;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Resume Subscription
      .addCase(resumeSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resumeSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload.subscription;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Subscription
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload.subscription;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = action.payload.paymentMethods;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Payment Method
      .addCase(addPaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods.push(action.payload.paymentMethod);
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove Payment Method
      .addCase(removePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        const paymentMethodId = action.payload;
        state.paymentMethods = state.paymentMethods.filter(
          pm => pm.id !== paymentMethodId
        );
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Set Default Payment Method
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        const { paymentMethodId } = action.payload;
        state.paymentMethods = state.paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === paymentMethodId
        }));
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload.invoices;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Payment History
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentHistory = action.payload.payments;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Validate Discount Code
      .addCase(validateDiscountCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateDiscountCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discounts.applied = action.payload.discount;
      })
      .addCase(validateDiscountCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.discounts.applied = null;
      })

      // Fetch Available Discounts
      .addCase(fetchAvailableDiscounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableDiscounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discounts.available = action.payload.discounts;
      })
      .addCase(fetchAvailableDiscounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCheckoutSession,
  setAppliedDiscount,
  clearAppliedDiscount,
  updateSubscriptionStatus,
  resetPaymentState,
} = paymentSlice.actions;

// Selectors
export const selectSubscriptionPlans = (state) => state.payment.subscriptionPlans;
export const selectCurrentSubscription = (state) => state.payment.currentSubscription;
export const selectPaymentMethods = (state) => state.payment.paymentMethods;
export const selectInvoices = (state) => state.payment.invoices;
export const selectPaymentHistory = (state) => state.payment.paymentHistory;
export const selectCheckoutSession = (state) => state.payment.checkoutSession;
export const selectAvailableDiscounts = (state) => state.payment.discounts.available;
export const selectAppliedDiscount = (state) => state.payment.discounts.applied;
export const selectPaymentLoading = (state) => state.payment.isLoading;
export const selectPaymentError = (state) => state.payment.error;

// Computed selectors
export const selectIsSubscribed = (state) => {
  const subscription = state.payment.currentSubscription;
  return subscription && subscription.status === 'active';
};

export const selectSubscriptionPlan = (state) => {
  const subscription = state.payment.currentSubscription;
  const plans = state.payment.subscriptionPlans;
  if (!subscription || !plans.length) return null;
  return plans.find(plan => plan.id === subscription.planId);
};

export const selectDefaultPaymentMethod = (state) => {
  return state.payment.paymentMethods.find(pm => pm.isDefault);
};

export default paymentSlice.reducer;
