import { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import SelectedSlots from './components/SelectedSlots';
import CalendarDays from './components/CalendarDays';
import CalendarSlots from './components/CalendarSlots';

// Dummy UK availability
const ukSlots = {
  Sat: { slots: ['10:00', '10:30', '11:00'] },
  Sun: { slots: ['14:00', '14:30', '15:00'] },
  Mon: { slots: ['18:00', '18:30', '19:00'] },
};

// Dummy booked slots (local date keys later mapped)
const bookedSlots = {
  '27-09-2025': { '10:00': 'booked' },
  '29-09-2025': { '14:00': 'booked', '14:30': 'booked' },
};

const UK_TIMEZONE = 'Europe/London';

export default function App() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Convert UK time → User local time
  const convertUKToLocal = (dayDate, time) => {
    const [h, m] = time.split(':');
    const ukDate = new Date(
      Date.UTC(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate(),
        h,
        m
      )
    );

    const utcString = ukDate.toLocaleString('en-US', { timeZone: 'UTC' });
    const ukLocalString = new Date(utcString).toLocaleString('en-US', {
      timeZone: UK_TIMEZONE,
    });

    const local = new Date(
      new Date(ukLocalString).toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );

    return local;
  };

  const formatTime12 = (date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const formatDayKey = (date) =>
    `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${date.getFullYear()}`;

  // Build 7-day calendar starting tomorrow
  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      const weekday = day.toLocaleString('en-US', { weekday: 'short' });
      const ukDaySlots = ukSlots[weekday]?.slots || [];

      const localSlots = [];

      ukDaySlots.forEach((slot) => {
        const converted = convertUKToLocal(day, slot);
        const convertedDay = converted.toLocaleString('en-US', {
          weekday: 'short',
        });

        const formatted = formatTime12(converted);

        const dayKey = formatDayKey(converted);
        const isBooked = bookedSlots[dayKey]?.[slot];

        if (!isBooked)
          localSlots.push({
            ukTime: slot,
            userTime: formatted,
            localISO: converted.toISOString(),
            localDisplay: converted,
            calendarDay: convertedDay,
            fullDate: converted,
          });
      });

      days.push({ date: day, slots: localSlots });
    }

    setCalendarDays(days);
  }, []);

  const toggleSlot = (slot) => {
    const exists = selectedSlots.find((s) => s.localISO === slot.localISO);

    if (exists) {
      setSelectedSlots((prev) =>
        prev.filter((s) => s.localISO !== slot.localISO)
      );
    } else {
      if (selectedSlots.length >= 15) {
        alert('Maximum 15 slots allowed.');
        return;
      }

      setSelectedSlots((prev) => [
        ...prev,
        {
          selectedSlot: slot.localISO,
          displayTime: slot.userTime,
          specialistTime: `${slot.ukTime} UK`,
        },
      ]);
    }
  };

  const isDisabled = (slot) => {
    const now = new Date();
    const diffHours = (new Date(slot.localISO) - now) / (1000 * 60 * 60);

    return diffHours < 24;
  };

  const handleBookNow = () => {
    console.log(selectedSlots);
  };

  return (
    <div className="calendar-wrapper">
      <CalendarDays calendarDays={calendarDays} />

      <CalendarSlots
        calendarDays={calendarDays}
        selectedSlots={selectedSlots}
        toggleSlot={toggleSlot}
        isDisabled={isDisabled}
      />

      <SelectedSlots selectedSlots={selectedSlots} />

      <Footer handleBookNow={handleBookNow} />
    </div>
  );
}
