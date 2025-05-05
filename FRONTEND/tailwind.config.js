/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "airbnb-pink": "#FF5A5F",
                "airbnb-pink-dark": "#E04E54",
            },
        },
    },
    plugins: [],
};
