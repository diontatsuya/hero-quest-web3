import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./contract/heroQuestABI.json";

const contractAddress = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26"; // Replace with your real address

export default function App() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const getStatus = async () => {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const res = await contract.getStatus(account);
    setStatus(res);
  };

  const attack = async () => {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    setLoading(true);
    const tx = await contract.attack();
    await tx.wait();
    setLoading(false);
    getStatus();
  };

  useEffect(() => {
    if (account) getStatus();
  }, [account]);

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Hero Quest</h1>
      {!account ? (
        <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">Connect Wallet</button>
      ) : (
        <>
          <div className="mb-4">Connected: {account}</div>
          {status && (
            <div className="mb-4">
              <p>HP: {status.hp.toString()}</p>
              <p>XP: {status.xp.toString()}</p>
              <p>Level: {status.level.toString()}</p>
            </div>
          )}
          <button onClick={attack} disabled={loading} className="bg-red-600 px-4 py-2 rounded">
            {loading ? "Attacking..." : "Attack Monster"}
          </button>
        </>
      )}
    </div>
  );
}