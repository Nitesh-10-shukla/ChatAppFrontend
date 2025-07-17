import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string) => {
      return searchParams?.get(key) || null;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(key, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete(key);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return { getParam, setParam, removeParam };
};
