import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("grenify-theme")||"wireframe", // Default theme is 'wireframe'
  setTheme: (theme) => {
    localStorage.setItem("grenify-theme", theme);
    set({ theme });
  },
}));