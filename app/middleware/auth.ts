export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn.value && to.path !== '/admin') {
    return navigateTo('/admin')
  };

  if (isLoggedIn.value && to.path === '/admin') {
    return navigateTo('/admin/dashboard')
  }
})