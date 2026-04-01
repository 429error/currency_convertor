import { useState, useEffect, useCallback, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', country: 'United States', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', country: 'European Union', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', country: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', country: 'Japan', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', country: 'India', flag: '🇮🇳' },
  { code: 'AUD', name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', country: 'China', flag: '🇨🇳' },
  { code: 'SEK', name: 'Swedish Krona', country: 'Sweden', flag: '🇸🇪' },
  { code: 'NZD', name: 'New Zealand Dollar', country: 'New Zealand', flag: '🇳🇿' },
  { code: 'MXN', name: 'Mexican Peso', country: 'Mexico', flag: '🇲🇽' },
  { code: 'SGD', name: 'Singapore Dollar', country: 'Singapore', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'NOK', name: 'Norwegian Krone', country: 'Norway', flag: '🇳🇴' },
  { code: 'KRW', name: 'South Korean Won', country: 'South Korea', flag: '🇰🇷' },
  { code: 'TRY', name: 'Turkish Lira', country: 'Turkey', flag: '🇹🇷' },
  { code: 'RUB', name: 'Russian Ruble', country: 'Russia', flag: '🇷🇺' },
  { code: 'BRL', name: 'Brazilian Real', country: 'Brazil', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', country: 'South Africa', flag: '🇿🇦' },
  { code: 'DKK', name: 'Danish Krone', country: 'Denmark', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', country: 'Poland', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', country: 'Thailand', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'HUF', name: 'Hungarian Forint', country: 'Hungary', flag: '🇭🇺' },
  { code: 'CZK', name: 'Czech Koruna', country: 'Czech Republic', flag: '🇨🇿' },
  { code: 'ILS', name: 'Israeli Shekel', country: 'Israel', flag: '🇮🇱' },
  { code: 'CLP', name: 'Chilean Peso', country: 'Chile', flag: '🇨🇱' },
  { code: 'PHP', name: 'Philippine Peso', country: 'Philippines', flag: '🇵🇭' },
  { code: 'AED', name: 'UAE Dirham', country: 'UAE', flag: '🇦🇪' },
  { code: 'COP', name: 'Colombian Peso', country: 'Colombia', flag: '🇨🇴' },
  { code: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MYR', name: 'Malaysian Ringgit', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'RON', name: 'Romanian Leu', country: 'Romania', flag: '🇷🇴' },
  { code: 'VND', name: 'Vietnamese Dong', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'EGP', name: 'Egyptian Pound', country: 'Egypt', flag: '🇪🇬' },
  { code: 'PKR', name: 'Pakistani Rupee', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'NGN', name: 'Nigerian Naira', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', country: 'Ukraine', flag: '🇺🇦' },
  { code: 'PEN', name: 'Peruvian Sol', country: 'Peru', flag: '🇵🇪' },
  { code: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait', flag: '🇰🇼' },
  { code: 'QAR', name: 'Qatari Riyal', country: 'Qatar', flag: '🇶🇦' },
].sort((a, b) => a.country.localeCompare(b.country))

const API_BASE = 'https://api.frankfurter.app'

function App() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [rate, setRate] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [recentConversions, setRecentConversions] = useState([])
  const [loading, setLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [timeRange, setTimeRange] = useState(30)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('recentConversions')
    if (saved) {
      setRecentConversions(JSON.parse(saved))
    }
  }, [])

  const fetchRate = useCallback(async () => {
    if (fromCurrency === toCurrency) {
      setRate(1)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/latest?from=${fromCurrency}&to=${toCurrency}`)
      const data = await res.json()
      setRate(data.rates[toCurrency])
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to fetch exchange rate')
    } finally {
      setLoading(false)
    }
  }, [fromCurrency, toCurrency])

  const fetchHistoricalData = useCallback(async () => {
    if (fromCurrency === toCurrency) {
      setHistoricalData([])
      return
    }
    setChartLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - timeRange)
      
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]
      
      const res = await fetch(`${API_BASE}/${startStr}..${endStr}?from=${fromCurrency}&to=${toCurrency}`)
      const data = await res.json()
      
      const chartData = Object.entries(data.rates).map(([date, rates]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rate: rates[toCurrency]
      }))
      setHistoricalData(chartData)
    } catch (err) {
      console.error('Failed to fetch historical data')
    } finally {
      setChartLoading(false)
    }
  }, [fromCurrency, toCurrency, timeRange])

  useEffect(() => {
    fetchRate()
  }, [fetchRate])

  useEffect(() => {
    fetchHistoricalData()
  }, [fetchHistoricalData])

  const handleConvert = () => {
    if (!rate || !amount) return
    
    const result = (amount * rate).toFixed(2)
    const newConversion = {
      id: Date.now(),
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount).toFixed(2),
      result,
      rate: rate.toFixed(4),
      timestamp: new Date().toISOString()
    }
    
    const updated = [newConversion, ...recentConversions].slice(0, 10)
    setRecentConversions(updated)
    localStorage.setItem('recentConversions', JSON.stringify(updated))
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const loadRecentConversion = (conv) => {
    setFromCurrency(conv.from)
    setToCurrency(conv.to)
    setAmount(conv.amount)
  }

  const clearRecent = () => {
    setRecentConversions([])
    localStorage.removeItem('recentConversions')
  }

  const convertedAmount = rate ? (amount * rate).toFixed(2) : '—'

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
            CurrencyXchange
          </h1>
          <p className="text-slate-400">Real-time currency conversion with live market rates</p>
        </header>

        <div className="flex flex-col lg:flex-row justify-center lg:items-start gap-8 w-full">
          <section className="flex-1 max-w-2xl mx-auto lg:mx-0 space-y-8">
            <div className="card p-6 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="w-full">
                  <label className="block text-sm text-slate-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-xl font-mono text-white input-glow"
                    placeholder="Enter amount"
                    min="0"
                    step="any"
                  />
                </div>
                
                <div className="w-full">
                  <CurrencyDropdown
                    label="From"
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    currencies={CURRENCIES}
                  />
                </div>

                <button
                  onClick={handleSwap}
                  className="swap-btn p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors mx-auto lg:mx-1"
                >
                  <svg className="w-32 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h14m4 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <div className="w-full">
                  <CurrencyDropdown
                    label="To"
                    value={toCurrency}
                    onChange={setToCurrency}
                    currencies={CURRENCIES}
                  />
                </div>
              </div>

              <div className="mt-6 md:mt-10 p-6 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Converted Amount</p>
                    <p className="text-2xl md:text-4xl font-mono font-bold text-white mt-1">
                      {loading ? (
                        <span className="text-cyan-400">Loading...</span>
                      ) : (
                        <span className="text-cyan-400">{convertedAmount}</span>
                      )}
                      <span className="text-base md:text-lg text-slate-400 ml-2">{toCurrency}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleConvert}
                    className="btn-primary px-6 py-3 rounded-xl text-lg w-full sm:w-auto"
                  >
                    Save Conversion
                  </button>
                </div>
                {rate && !loading && (
                  <p className="text-slate-500 text-sm mt-3">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                    {lastUpdated && ` • Updated ${lastUpdated.toLocaleTimeString()}`}
                  </p>
                )}
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              </div>
            </div>

            <div className="card p-6 md:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-white">Exchange Rate Trend</h2>
                <div className="flex gap-2">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeRange(days)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        timeRange === days
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-48 sm:h-64">
                {chartLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-slate-400">Loading chart...</div>
                  </div>
                ) : historicalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => val.toFixed(2)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#12121a',
                          border: '1px solid #1e293b',
                          borderRadius: '12px',
                          color: '#f8fafc'
                        }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRate)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    Select different currencies to view trend
                  </div>
                )}
              </div>
              
              {historicalData.length > 0 && (
                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-slate-400">High: </span>
                    <span className="text-emerald-400 font-mono">
                      {Math.max(...historicalData.map(d => d.rate)).toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Low: </span>
                    <span className="text-red-400 font-mono">
                      {Math.min(...historicalData.map(d => d.rate)).toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg: </span>
                    <span className="text-slate-300 font-mono">
                      {(historicalData.reduce((a, b) => a + b.rate, 0) / historicalData.length).toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="card p-6 md:p-8 h-fit w-full lg:max-w-xs shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent</h2>
              {recentConversions.length > 0 && (
                <button
                  onClick={clearRecent}
                  className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {recentConversions.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent conversions</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentConversions.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadRecentConversion(conv)}
                    className="w-full text-left p-3 bg-[#0a0a0f] rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400">{conv.from}</span>
                        <span className="text-slate-500">→</span>
                        <span className="font-mono text-violet-400">{conv.to}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(conv.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      <span className="font-mono">{conv.amount}</span>
                      <span className="text-slate-500 mx-1">=</span>
                      <span className="font-mono text-white">{conv.result}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>

        <footer className="text-center mt-8 text-slate-500 text-sm pb-4">
          <p>Exchange rates by <a href="https://www.frankfurter.app" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">Frankfurter</a> • Updated daily from ECB</p>
        </footer>
      </div>
    </div>
  )
}

function CurrencyDropdown({ label, value, onChange, currencies }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  const filtered = currencies.filter(
    c => c.code.toLowerCase().includes(search.toLowerCase()) ||
         c.country.toLowerCase().includes(search.toLowerCase()) ||
         c.name.toLowerCase().includes(search.toLowerCase())
  )

  const selected = currencies.find(c => c.code === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full min-w-[180px]" ref={dropdownRef}>
      <label className="block text-sm text-slate-400 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0a0a0f] border border-slate-700 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-slate-600 transition-colors min-h-[52px]"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-xl shrink-0">{selected?.flag}</span>
          <span className="text-white truncate">{selected?.country}</span>
          <span className="text-slate-500 text-sm shrink-0">({selected?.code})</span>
        </span>
        <svg className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#12121a] border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-2 border-b border-slate-700">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  onChange(curr.code)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-cyan-500/10 transition-colors ${
                  curr.code === value ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                }`}
              >
                <span className="text-xl">{curr.flag}</span>
                <span className="flex-1">{curr.country}</span>
                <span className="text-slate-500 text-sm font-mono">{curr.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
