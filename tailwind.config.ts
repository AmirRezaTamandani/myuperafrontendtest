import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customBtn: "#624DE3",
        customBg: "#1D1E42",
        customBgAssent: "#26264F",
        customPagination: "#141432",
        customDeleteBtn: "#A30D11",
        deliveredBtnText: "#1F9254",
        deliveredBtn: "#EBF9F1",
        processingBtnText: "#CD6200",
        processingBtn: "#FEF2E5",
        cancelledBtnText: "#A30D11",
        cancelledBtn: "#FBE7E8",
      },
    },
  },
  plugins: [],
};
export default config;
