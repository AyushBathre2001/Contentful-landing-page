# Tiger Analytics - Contentful CMS Website

A modern, dynamic website built with Next.js 16 and powered by Contentful CMS. This project features a fully customizable landing page with multiple section types, all manageable through Contentful's content management system.

## 🚀 Features

- **Headless CMS Integration** - Content managed via Contentful
- **Dynamic Page Sections** - Modular components rendered from CMS
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type-Safe** - Built with TypeScript
- **Modern UI Components** - Radix UI primitives with custom styling
- **Smooth Animations** - Framer Motion for interactive elements
- **Error Handling** - Graceful fallbacks when content is unavailable
- **SEO Optimized** - Server-side rendering with Next.js App Router

## 📦 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **CMS:** Contentful
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## 🎨 Available Components

The project includes the following dynamic sections:

- **Hero Section** - Eye-catching landing section with CTA buttons
- **Feature Section** - Showcase features with carousel
- **Tabbed Showcase** - Interactive tabbed content display
- **Testimonial Grid** - Customer testimonials in bento grid layout
- **FAQ Section** - Accordion-style frequently asked questions
- **Highlight Section** - Feature highlights with imagery
- **Sponsors Section** - Logo marquee of sponsors/partners
- **Competition Leaderboard** - Visual ranking display
- **Promo Banner** - Call-to-action promotional banner
- **Title Blocks Section** - Content blocks with headings

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ installed
- Contentful account with Space ID and Access Token

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tiger_analytics-master
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

   > **Note:** The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

| Variable                              | Description                                | Required |
| ------------------------------------- | ------------------------------------------ | -------- |
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`     | Your Contentful Space ID                   | Yes      |
| `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` | Your Contentful Content Delivery API token | Yes      |

## 🏗️ Project Structure

```
tiger_analytics-master/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Hero section
│   ├── LoadingPage.tsx   # Loading state component
│   └── ...               # Other section components
├── lib/
│   ├── contentful.ts     # Contentful client & helpers
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🎯 Content Management

### Setting up Contentful

1. Create a Contentful space
2. Set up the following content types:
   - `header` - Site header configuration
   - `landingPage` - Main page container
   - `globalFooter` - Site footer
   - Section types (heroSection, featureSection, etc.)

3. Populate your content in Contentful
4. The website will automatically fetch and render the content

### Error Handling

The application includes robust error handling:

- **Missing Environment Variables** - Shows loading state
- **API Failures** - Gracefully falls back to loading component
- **Partial Data** - Validates critical data before rendering

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
   - `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy!

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For support, please contact the project maintainers.

---

Built with ❤️ using Next.js and Contentful
