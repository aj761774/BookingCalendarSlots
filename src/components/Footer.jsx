const Footer = ({ handleBookNow }) => {
  return (
    <div className="footer-bar">
      <div></div>
      <button className="book-btn" onClick={handleBookNow}>
        Book Now
      </button>
    </div>
  );
};

export default Footer;
