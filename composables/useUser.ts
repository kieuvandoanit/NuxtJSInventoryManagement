export const useUser = () => {
  const user = useState('user', () => {
    const storedUser = localStorage.getItem('QLTK_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (userData: any) => {
    user.value = userData; // Update the reactive state
    localStorage.setItem('QLTK_user', JSON.stringify(userData)); // Store in localStorage
  };

  const clearUser = () => {
    user.value = null; // Clear the user state
    localStorage.removeItem('QLTK_user'); // Remove from localStorage
  };

  return { user, setUser, clearUser };
}
