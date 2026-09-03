'use client';

import { useState, useEffect } from 'react';
import { ScheduleBlock } from '@planaday/shared-types';

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
const API_BASE = 'http://localhost:3001/api';

export default function Home() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startHour, setStartHour] = useState(HOURS[0]);
  
  function getTodayISO(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function fetchBlocks() {
    try {
      const today = getTodayISO();
      const res = await fetch(`${API_BASE}/schedule?date=${today}`);
      if (!res.ok) throw new Error('Failed to fetch schedule blocks');
      const data = await res.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  }

  async function handleAddBlock() {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newTitle = title;
    setTitle(''); // Clear input immediately for snappy UX

    try {
      const res = await fetch(`${API_BASE}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: getTodayISO(),
          startHour: startHour,
          endHour: startHour + 1,
          title: newTitle,
          status: 'planned',
          createdBy: 'user',
        }),
      });

      if (res.ok) {
        await fetchBlocks();
      }
    } catch (error) {
      console.error('Error adding block:', error);
      setTitle(newTitle); // Revert title on failure
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    fetchBlocks();
  }, []);

  return (
    <main>
      <h1>DayPlan</h1>
      
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Event title..."
        disabled={isSubmitting}
      />
      <button onClick={handleAddBlock} disabled={isSubmitting || !title.trim()}>
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
      <select
        value={startHour}
        onChange={(e) => setStartHour(Number(e.target.value))}
      >{HOURS.map((hour) => (
    <option key={hour} value={hour}>
      {hour}:00
    </option>
  ))}</select>
      {HOURS.map((hour) => {
        const matches = blocks.filter((block) => block.startHour === hour);
        return (
          <div key={hour}>
            {hour}:00
            {matches.map((block) => (
              <span key={block.id}> - {block.title}</span>
            ))}
          </div>
        );
      })}
    </main>
  );
}