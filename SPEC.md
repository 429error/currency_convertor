# Currency Converter Web App - Specification

## Project Overview
- **Name**: CurrencyXchange
- **Type**: React Web Application
- **Core Functionality**: Real-time currency conversion with live exchange rates and trend charts
- **Target Users**: Travelers, traders, and anyone needing quick currency conversions

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **API**: Frankfurter API (free, no key required, ECB reference rates)
- **Charts**: Recharts
- **State**: React hooks + LocalStorage for recent conversions

## UI/UX Specification

### Layout Structure
- **Header**: App logo/name, tagline
- **Main Content**: 
  - Converter card (input, dropdowns, result)
  - Trend chart section
  - Recent conversions sidebar/section
- **Responsive**: Mobile-first, breakpoints at 640px, 768px, 1024px

### Color Palette
- **Background**: `#0a0a0f` (deep dark)
- **Card Background**: `#12121a` (dark slate)
- **Primary Accent**: `#22d3ee` (cyan-400)
- **Secondary Accent**: `#a78bfa` (violet-400)
- **Success/Positive**: `#34d399` (emerald-400)
- **Error/Negative**: `#f87171` (red-400)
- **Text Primary**: `#f8fafc` (slate-50)
- **Text Secondary**: `#94a3b8` (slate-400)
- **Border**: `#1e293b` (slate-800)

### Typography
- **Font Family**: "Outfit" (Google Fonts) - modern geometric sans-serif
- **Headings**: 700 weight
- **Body**: 400 weight
- **Numbers/Amount**: "JetBrains Mono" (monospace for currency values)

### Components

#### 1. Currency Converter Card
- Two dropdowns (From/To) with search/filter capability
- Amount input with currency symbol
- Swap button (animated rotate on click)
- Live conversion result with rate display
- Last updated timestamp

#### 2. Trend Chart
- Line chart showing 30-day exchange rate history
- Tooltip with date and rate
- Gradient fill under line
- Responsive sizing
- Time range selector (7D, 30D, 90D)

#### 3. Recent Conversions
- List of last 10 conversions
- Shows: currencies, amount, result, timestamp
- Clickable to restore that conversion
- Clear all button

#### 4. Currency Dropdown
- Alphabetically sorted list
- Currency code + country flag emoji
- Search/filter input
- Highlight selected currency

### Visual Effects
- Subtle glow on focused inputs (`box-shadow: 0 0 20px rgba(34, 211, 238, 0.2)`)
- Smooth transitions (200ms ease)
- Card hover lift effect
- Loading skeleton states
- Staggered entrance animations

## Functionality Specification

### Core Features
1. **Currency Conversion**
   - Fetch live rates from Frankfurter API
   - Support 30+ major currencies
   - Real-time calculation on input change
   - Display conversion rate

2. **Trend Charts**
   - Fetch historical data (up to 90 days)
   - Display interactive line chart
   - Show high/low/average rates
   - Handle loading and error states

3. **Recent Conversions**
   - Store last 10 conversions in LocalStorage
   - Display timestamp for each
   - Allow restoring any recent conversion
   - Auto-add on successful conversion

4. **Currency List**
   - Alphabetically sorted
   - Include major world currencies (USD, EUR, GBP, JPY, INR, etc.)
   - Show currency code and full name

### API Endpoints
- `GET /latest?from=USD&to=EUR` - Get latest rates
- `GET /USD/history?start=2024-01-01&end=2024-01-31` - Get historical

### Edge Cases
- Handle API errors gracefully
- Show loading states during fetch
- Validate input (positive numbers only)
- Handle offline state
- Rate limit handling

## Acceptance Criteria
1. ✅ User can select From/To currencies from dropdowns
2. ✅ Dropdown list is alphabetically sorted
3. ✅ Conversion updates automatically when amount changes
4. ✅ Exchange rate comes from live API (updated daily from ECB)
5. ✅ Trend chart displays historical rates for selected pair
6. ✅ Recent conversions are persisted and clickable
7. ✅ UI is mobile-responsive
8. ✅ Professional, modern dark theme
9. ✅ No console errors on load
10. ✅ Smooth animations and transitions
