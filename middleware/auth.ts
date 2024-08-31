export default defineNuxtRouteMiddleware((to, from) => {
  // get localStorage data
  const userData = localStorage.getItem('QLTK_user');

  if (userData) {
    try {
      JSON.parse(userData);
    } catch (error) {
      return navigateTo('/login');  
    }
  } else {
    return navigateTo('/login');
  }
})
