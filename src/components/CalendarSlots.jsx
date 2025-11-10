const CalendarSlots = ({
  calendarDays,
  selectedSlots,
  toggleSlot,
  isDisabled,
}) => {
  return (
    <div className="calendar-slots">
      {calendarDays.map((day, i) =>
        day.slots.length === 0 ? (
          <div key={i} className="no-slots">
            No Slots
          </div>
        ) : (
          <div
            key={i}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {day.slots.map((slot, si) => {
              const selected = selectedSlots.some(
                (s) => s.selectedSlot === slot.localISO
              );
              return (
                <button
                  key={si}
                  className={`slot-btn ${selected ? 'slot-selected' : ''} ${
                    isDisabled(slot) ? 'slot-disabled' : ''
                  }`}
                  onClick={() => toggleSlot(slot)}
                  disabled={isDisabled(slot)}
                >
                  {slot.userTime}
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default CalendarSlots;
