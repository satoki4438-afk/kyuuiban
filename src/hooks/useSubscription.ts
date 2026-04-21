import { useState, useEffect } from 'react';
import { Purchases, ENTITLEMENT_ID } from '../lib/purchases';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Purchases.getCustomerInfo()
      .then(info => {
        if (!mounted) return;
        setIsSubscribed(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    Purchases.addCustomerInfoUpdateListener(info => {
      if (!mounted) return;
      setIsSubscribed(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
    });

    return () => { mounted = false; };
  }, []);

  return { isSubscribed, loading };
}
