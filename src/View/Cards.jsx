import { useState, useEffect } from "react";
import Button from "../components/Button";
import "./Cards.css";
import axios from "axios";
import { Howl } from "howler";
import Snap from "../assets/sounds/snap_sound.mp3";
import Logo from "../assets/logo.png";

const Card = () => {
  const [deckId, setDeckId] = useState(null);
  const [cardsDrawn, setCardsDrawn] = useState([]);
  const [snapMessage, setSnapMessage] = useState("");
  const [valueMatchCount, setValueMatchCount] = useState(0);
  const [suitMatchCount, setSuitMatchCount] = useState(0);

  const cardDeck = () => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => {
        setDeckId(res.data.deck_id);
      })
      .catch((err) => {
        console.error("error loading card:", err);
      });
  };
  useEffect(() => {
    cardDeck();
  }, []);

  const drawCard = () => {
    if (deckId && cardsDrawn.length < 52) {
      axios
        .get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then((res) => {
          const newCard = res.data.cards[0];
          const lastCard = cardsDrawn[cardsDrawn.length - 1];
          handleSnap(newCard, lastCard);
          setCardsDrawn([...cardsDrawn, newCard]);
        });
    }
  };

  const handleSnap = (newCard, lastCard) => {
    if (!lastCard) {
      setSnapMessage("");
      return;
    }
    const valueMatch = newCard.value === lastCard.value;
    const suitMatch = newCard.suit === lastCard.suit;

    if (valueMatch) setValueMatchCount(valueMatchCount + 1);
    if (suitMatch) setSuitMatchCount(suitMatchCount + 1);

    if (valueMatch && suitMatch) {
      snapSound.play();
      setSnapMessage("SNAP VALUE and SUIT!");
    } else if (valueMatch) {
      snapSound.play();
      setSnapMessage("SNAP VALUE!");
    } else if (suitMatch) {
      snapSound.play();
      setSnapMessage("SNAP SUIT!");
    } else {
      setSnapMessage("");
    }
  };

  const renderCard = (card, key) => (
    <img
      key={key}
      src={card.image}
      alt={`${card.value} of ${card.suit}`}
      className="deck"
    />
  );

  const renderPlaceholder = () => <div className="deck"></div>;

  const snapSound = new Howl({
    src: [Snap],
    volume: 1.0,
  });

  //   const cardDrawSound = new Howl({
  //     src: [Shuffle],
  //     volume: 1.0,
  //   });
  const restartGame = () => {
    cardDeck();
    setCardsDrawn([]);
  };

  return (
    <div>
      <div className="header">
        <span className="header-title">SNAP!</span>
        <img src={Logo} alt="logo" />
      </div>

      <div className="container">
        <div className="content">
          <div className="snap-msg">
            {snapMessage && <h2>{snapMessage}</h2>}
          </div>

          <div className="card-decks">
            <div className="deck">
              {cardsDrawn.length > 1
                ? renderCard(cardsDrawn[cardsDrawn.length - 2], "previous")
                : renderPlaceholder()}
            </div>

            <div className="deck">
              {" "}
              {cardsDrawn.length > 0
                ? renderCard(cardsDrawn[cardsDrawn.length - 1], "current")
                : renderPlaceholder()}
            </div>
          </div>
        </div>

        <div className="card-count">
          {cardsDrawn.length === 52 && (
            <>
              <div className="value">
                Total Value Matched - {valueMatchCount}
              </div>
              <div className="suits">
                Total Suits Matched - {suitMatchCount}
              </div>
            </>
          )}
        </div>

        <p className="cards-left">
          {cardsDrawn.length} cards drawn, {52 - cardsDrawn.length} cards
          remaining
        </p>

        <div className="btn">
          {cardsDrawn.length < 52 && (
            <Button text={"Draw Card"} onClick={drawCard} className="button" />
          )}

          {cardsDrawn.length >= 52 && (
            <Button
              text={"Restart Deck"}
              className="button"
              onClick={restartGame}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
