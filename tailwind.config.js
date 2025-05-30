module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
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
          background: "#f0f0f0",
          context: "#e0e0e0",
          secondary: "#ffffff",
          accent: "#eeeeee",
          accent2: "#cdcdcd",
        },
        type: {
          emphasized: "#1b1b1b",
          subheader: "#252525",
          dimmed: "#303030",
          darker: "#444444",
          footer: "#6b7280",
          secondary: "#555555",
        },
      },
    },
  },
};
