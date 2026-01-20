import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Linking } from 'react-native';

export function useAuth() {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["/api/auth/user"],
        queryFn: async () => {
            try {
                const response = await api.get("/api/auth/user");
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const loginWithGoogle = async () => {
        // Open the browser for Google OAuth with mobile flag
        const baseUrl = api.defaults.baseURL;
        Linking.openURL(`${baseUrl}/api/auth/mobile-init`);
    };

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.get("/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/auth/user"], null);
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout: logoutMutation.mutate,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
    };
}
