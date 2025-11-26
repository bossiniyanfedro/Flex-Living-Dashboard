"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type ApprovedState = Record<string, number[]>;

const STORAGE_KEY = "flex-approved-reviews";

type ReviewSelectionContextValue = {
  approvedMap: ApprovedState;
  isApproved: (listingId: string, reviewId: number) => boolean;
  toggleReview: (listingId: string, reviewId: number) => void;
  bulkApprove: (listingId: string, reviewIds: number[]) => void;
};

const ReviewSelectionContext = createContext<ReviewSelectionContextValue | null>(
  null
);

export const ReviewSelectionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [approvedMap, setApprovedMap] = useState<ApprovedState>({});

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApprovedMap(JSON.parse(stored));
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  const persist = useCallback((next: ApprovedState) => {
    setApprovedMap(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const toggleReview = useCallback(
    (listingId: string, reviewId: number) => {
      persist({
        ...approvedMap,
        [listingId]: approvedMap[listingId]?.includes(reviewId)
          ? approvedMap[listingId]?.filter((id) => id !== reviewId) ?? []
          : [...(approvedMap[listingId] ?? []), reviewId]
      });
    },
    [approvedMap, persist]
  );

  const bulkApprove = useCallback(
    (listingId: string, reviewIds: number[]) => {
      persist({
        ...approvedMap,
        [listingId]: Array.from(new Set([...(approvedMap[listingId] ?? []), ...reviewIds]))
      });
    },
    [approvedMap, persist]
  );

  const isApproved = useCallback(
    (listingId: string, reviewId: number) =>
      approvedMap[listingId]?.includes(reviewId) ?? false,
    [approvedMap]
  );

  const value = useMemo(
    () => ({
      approvedMap,
      toggleReview,
      bulkApprove,
      isApproved
    }),
    [approvedMap, bulkApprove, toggleReview, isApproved]
  );

  return (
    <ReviewSelectionContext.Provider value={value}>
      {children}
    </ReviewSelectionContext.Provider>
  );
};

export const useReviewSelection = () => {
  const context = useContext(ReviewSelectionContext);
  if (!context) {
    throw new Error("useReviewSelection must be used within ReviewSelectionProvider");
  }
  return context;
};

