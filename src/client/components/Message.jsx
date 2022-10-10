import React from "react";
import { shortenAddress } from "../utils/helper";

const Message = ({ from, to, message, amount, timestamp }) => {
  return (
    <div className="message">
      <p className="address">FROM: {shortenAddress(from)}</p>
      <p className="address">TO: {shortenAddress(to)}</p>
      <p className="text">{message}</p>
      <p className="time">Amount: {amount / 10 ** 18 }ETH</p>
      <p className="time">Time: {timestamp}</p>
    </div>
  );
};

export default Message;
