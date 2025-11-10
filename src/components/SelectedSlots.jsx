const SelectedSlots = ({ selectedSlots }) => {
  return (
    <div className="selected-slots-wrapper">
      {selectedSlots.map((s, i) => (
        <div key={i} className="selected-pill">
          {new Date(s.selectedSlot).toLocaleDateString('en-GB')} (
          {s.displayTime})
        </div>
      ))}
    </div>
  );
};

export default SelectedSlots;
