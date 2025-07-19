# Next.js 15 Boilerplate with Tailwind CSS v3

A modern, feature-rich starter template built with Next.js 15, React 19, TypeScript, and Tailwind CSS v3.

## Features

- ⚡️ [Next.js 15](https://nextjs.org/) - The React framework with App Router
- 🔥 [Turbopack](https://turbo.build/pack) - Optimized for development speed
- 🎨 [Tailwind CSS v3](https://tailwindcss.com/) - Utility-first CSS framework
- 📝 [TypeScript](https://www.typescriptlang.org/) - Type safety for your JavaScript
- 🧩 [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- 📦 [Class Variance Authority](https://cva.style/docs) - Type-safe UI component variants
- 🎭 [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings
- 🌈 [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind CSS classes without conflicts
- 🪄 [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- 🧹 [ESLint](https://eslint.org/) - Code linting tool

## Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

## Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/nextjs-15-boilerplate-tailwind-3.git
cd nextjs-15-boilerplate-tailwind-3
```

### Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # App Router directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global CSS
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   └── [other-components]  # Additional components
├── lib/                    # Utility functions and shared logic
│   └── utils.ts            # General utility functions
├── public/                 # Static assets
├── styles/                 # Additional styles (if needed)
├── types/                  # TypeScript type definitions
├── .eslintrc.json          # ESLint configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Tailwind Configuration

This boilerplate comes with a pre-configured `tailwind.config.js` that includes:

- Extended theme configuration
- Essential plugins like `tailwindcss-animate`
- Custom utility classes

## Using UI Components

The boilerplate includes utility functions in `lib/utils.ts` to help with class name management:

```typescript
import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button 
      className={cn("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", className)}
      {...props}
    />
  );
}
```

## Customization

### Changing the Theme

Edit the `tailwind.config.js` file to customize your theme:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // Add your color palette
        },
      },
      // Add more theme customizations
    },
  },
  // Other configurations
}
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Radix UI](https://www.radix-ui.com/)