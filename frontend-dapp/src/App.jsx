import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import wavePortal from './utils/WavePortal.json';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contractAddress = "0x818c51c1AdD9D277cB5830992026Df2777376480";

  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => ({
          address: wave.waver,
          timestamp: new Date(Number(wave.timestamp) * 1000),
          message: wave.message
        }));

        setAllWaves(wavesCleaned);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [...prevState, {
        address: from,
        timestamp: new Date(Number(timestamp) * 1000),
        message: message
      }]);
    };

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      provider.getSigner().then(signer => {
        wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);
        wavePortalContract.on("NewWave", onNewWave);
      });
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        await getAllWaves();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      await getAllWaves();
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      if (!message) {
        alert("Please enter a message!");
        return;
      }

      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

      const waveTxn = await wavePortalContract.wave(message);
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
      
      setMessage("");
      await getAllWaves(); // Refresh the waves list after successful transaction
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2">👋 Wave Portal</h1>
        
        <p className="text-gray-600 text-center mb-8">
          Connect your Ethereum wallet and wave at me with a message!
        </p>

        {!currentAccount ? (
          <button 
            onClick={connectWallet}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mb-6 transition duration-200"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={wave}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Wave"}
              </button>
            </div>

            <div className="space-y-4">
              {allWaves.map((wave, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">From:</span>
                    <span className="text-sm text-gray-600 truncate">
                      {wave.address}
                    </span>
                  </div>
                  <div className="text-gray-700">{wave.message}</div>
                  <div className="text-sm text-gray-500">
                    {wave.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}