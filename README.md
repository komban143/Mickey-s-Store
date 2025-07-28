# Mickey's Store

This is a modern e-commerce web application built with React, TypeScript, Tailwind CSS, and Supabase. It features authentication, product catalog, cart management, and category filtering.

## Features
- User authentication (Supabase)
- Product catalog with category filtering
- Shopping cart with sidebar
- Responsive design (Tailwind CSS)
- Database migrations (Supabase SQL)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```

### Build
```bash
npm run build
# or
yarn build
```

### Supabase Setup
- Place your Supabase credentials in `src/lib/supabase.ts`.
- Run migrations in `supabase/migrations/` as needed.

## Project Structure
- `src/` - Main source code
  - `components/` - React components
  - `contexts/` - React context providers (Auth, Cart)
  - `lib/` - Supabase client
- `supabase/migrations/` - SQL migration scripts

## License
MIT 