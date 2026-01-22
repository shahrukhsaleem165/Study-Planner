import { useMemo } from 'react'

const QUOTES = [
  {
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
  },
  {
    text: 'Small consistent steps beat rare bursts of intensity.',
    author: 'Unknown',
  },
  {
    text: 'Focus is a muscle; the more you train it, the stronger it gets.',
    author: 'Unknown',
  },
  {
    text: 'Action is the antidote to anxiety.',
    author: 'Unknown',
  },
  {
    text: 'The secret to getting ahead is getting started.',
    author: 'Mark Twain',
  },
]

export function useMotivationQuote() {
  const todayKey = new Date().toISOString().slice(0, 10)

  return useMemo(() => {
    const index = todayKey.split('-').join('').split('').reduce((acc, digit) => acc + Number(digit), 0)
    return QUOTES[index % QUOTES.length]
  }, [todayKey])
}

