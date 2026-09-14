export const useAuth = () => {
  const config = useRuntimeConfig();

  const token = useCookie<string | null>('auht_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  const isLoggedIn = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    const res = await $fetch<{ token: string }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password }
    });

    token.value = res.token;
    return res;
  };

  const logout = () => {
    token.value = null;
    navigateTo('/');
  };

  return {
    token,
    isLoggedIn,
    login,
    logout
  }
}