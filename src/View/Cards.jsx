import Button from "../components/Button";
import "./Cards.css";
const Card = () => {
  return (
    <div>
      <div className="header">
        <span className="header-title">SNAP!</span>
        <span className="header-menu">ooo</span>
      </div>

      <div className="container">
        <div className="content">
          <div className="snap-msg">
            <h2>SNAP VALUE!!!</h2>
          </div>

          <div className="card-decks">
            <div className="deck-1">{/* Card 1 */}</div>

            <div className="deck-2">{/* card 2 */}</div>
          </div>
        </div>

        <div className="card-count">
          <div className="value">Total Value of cards</div>
          <div className="suits">Total Suits of cards</div>
        </div>
        <div className="btn">
          <Button text={"Draw Card"} className="button" />
        </div>
      </div>
    </div>
  );
};

export default Card;
