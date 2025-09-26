'use client' // Needed for React state/hooks in App Router

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Message {
  id: number
  name: string
  message: string
  created_at: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMessages()

    // Realtime subscription for new messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => [payload.new as Message, ...prev])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setMessages(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !text) return
    setLoading(true)
    const { error } = await supabase
      .from('messages')
      .insert([{ name, message: text }])
    if (error) console.error(error)
    else {
      setName('')
      setText('')
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>Baby's First Website 👶🌟</h1>
      <p>Leave a short message or milestone for the baby!</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message (e.g., 'First smile!')"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save message'}
        </button>
      </form>

      <h2>Messages</h2>
      <ul>
        {messages.map(m => (
          <li key={m.id}>
            <strong>{m.name}</strong> — {m.message}{' '}
            <small>({new Date(m.created_at).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </main>
  )
}
