import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "@/lib/api/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      try {
        await Promise.allSettled([
          AuthApi.logout(),
          signOut({ redirect: false })
        ]);
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    onSuccess: () => {
      router.push('/login');
      router.refresh();
    }
  });
}