export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return Array.isArray(user.permissoes) && user.permissoes.includes(permission);
}
