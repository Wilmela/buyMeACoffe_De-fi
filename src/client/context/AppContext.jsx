import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../smart_contract/contractsData/";
const { ethereum } = window;

export const AppContext = createContext();

const getEthContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  return contract;
};

export const AppContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(window.localStorage.getItem("tipCount"));

  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const contract = getEthContract();
    try {
      const notes = await contract.getAllNotes();
      const res = await Promise.all(
        notes.map((note) => ({
          from: note.from,
          to: note.to,
          message: note.message,
          amount: note.amount.toString(),
          timestamp: new Date(
            note.timestamp.toNumber() * 1000
          ).toLocaleString(),
        }))
      );

      setAvailableNotes(res);
      console.log(res);
    } catch (error) {
      console.log(error.message);
    }
  };
  const checkForWallet = async () => {
    if (!ethereum) return "Please install meta mask";
     ethereum.on("chainChanged", () => {
       window.localStorage.reload();
     });
     ethereum.on("accountsChanged", async () => {
       await connectAccount();
     });
    try {
      const account = await ethereum.request({
        method: "eth_accounts",
      });

      if (account.length) {
        setCurrentAccount(account[0]);
        setConnected(true);

        fetchNotes();
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("No ethereum object found");
    }
  };
  const connectAccount = async () => {
   

    if (!ethereum) return "Please install meta mask";
    try {
      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (account.length) {
        setCurrentAccount(account[0]);
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("No ethereum object found");
    }
  };

  const toggleWallet = async () => {
    if (!connected) {
      await connectAccount();
      setConnected(true);
    } else {
      setCurrentAccount("");
      setConnected(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const checkForCount = async () => {
    const contract = getEthContract();
    const count = await contract.getTipCount();
    window.localStorage.setItem("tipCount", count);
  };

  const buyACoffee = async () => {
    const contract = getEthContract();
    try {
      let amount = await contract.getTipAmount();
      if (!message) return alert("Please add a message");
      const addMessage = await contract.tipMe(message, { value: amount });

      const count = await contract.getTipCount();
      setCount(count.toNumber());

      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const withdraw = async () => {
    const contract = getEthContract();
    try {
      if (ethereum) {
        const response = await contract.withdrawEth();

        await response.wait();
        window.location.reload();
      } else {
        alert("Please connect wallet");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    checkForWallet();
    checkForCount();
  }, [count]);
  return (
    <AppContext.Provider
      value={{
        toggleWallet,
        handleChange,
        message,
        currentAccount,
        connected,
        availableNotes,
        buyACoffee,
        withdraw,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
