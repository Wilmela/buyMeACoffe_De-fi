import { useContext } from "react";
import PF from "../assets/passport.jpg";
import Message from "./components/Message";
import { AppContext } from "./context/AppContext";
import { shortenAddress } from "./utils/helper";

const App = () => {
  const {
    toggleWallet,
    message,
    handleChange,
    currentAccount,
    connected,
    buyACoffee,
    availableNotes,
    withdraw,
    loading,
  } = useContext(AppContext);

  return (
    <section className="container">
    <div className="circle first" />
    <div className="circle second" />
      <div className="glass">

        <div className="side-bar">
          <div className="profile">
            <img src={PF} alt="profile" className="profile-image" />
            <h2>mela</h2>
            <p className="info">This is a buy me a coffee De-fi</p>
            <button type="button" onClick={withdraw}>
              Withdraw
            </button>
          </div>

          <form>
            <textarea
              name="message"
              rows="5"
              onChange={handleChange}
              value={message}
              placeholder="Drop a message"
            />
            <button type="button" onClick={buyACoffee}>
             {!loading ? 'Send 0.01 ETH' : 'loading...'}
            </button>

            <button type="button" onClick={toggleWallet}>
              {!connected ? "Connect Wallet" : "Disconnect Wallet"}
            </button>
            <p className="account">{shortenAddress(currentAccount)}</p>
          </form>
        </div>

        <div className="messages">
          {availableNotes.length === 0 ? 'Nothing to show' : availableNotes.map((note) => (
            <Message
              key={note.timestamp}
              from={note.from}
              to={note.to}
              message={note.message}
              amount={note.amount}
              timestamp={note.timestamp}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default App;
