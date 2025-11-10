const CalendarDays = ({ calendarDays }) => {
  return (
    <div className="calendar-header">
      {calendarDays.map((day, i) => (
        <div key={i}>
          <div className="day-name">
            {day.date.toLocaleString('en-US', { weekday: 'short' })}
          </div>
          <div className="day-date">{day.date.getDate()}</div>
        </div>
      ))}
    </div>
  );
};

export default CalendarDays;
