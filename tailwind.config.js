module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        mono: {
          background: {
            light: "#f5f5f7",
            dark: "#1d1d1f"
          },
          context: {
            light: "#e8e8ed",
            dark: "#2d2d30"
          },
          secondary: {
            light: "#ffffff",
            dark: "#2d2d2f"
          },
          accent: {
            light: "#f2f2f7",
            dark: "#3a3a3c"
          },
          accent2: {
            light: "#e5e5ea",
            dark: "#48484a"
          },
        },
        type: {
          emphasized: {
            light: "#1d1d1f",
            dark: "#f5f5f7"
          },
          subheader: {
            light: "#252529",
            dark: "#e8e8ed"
          },
          dimmed: {
            light: "#424245",
            dark: "#a1a1a6"
          },
          darker: {
            light: "#555555",
            dark: "#8e8e93"
          },
          footer: {
            light: "#6b7280",
            dark: "#86868b"
          },
          secondary: {
            light: "#636366",
            dark: "#aeaeb2"
          },
        },
      },
      borderRadius: {
        'fuji': '12px',
        'fuji-sm': '8px',
        'fuji-lg': '16px',
      },
      boxShadow: {
        'fuji': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'fuji-md': '0 8px 16px rgba(0, 0, 0, 0.06)',
        'fuji-lg': '0 12px 24px rgba(0, 0, 0, 0.08)',
        'fuji-dark': '0 4px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
};
