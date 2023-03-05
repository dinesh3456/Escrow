import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/Escrow.json';
import { Web3Provider } from "@ethersproject/providers";


const CONTRACT_ADDRESS = "0x89674046c56E1d4dD6763cD468fC51C6FCA0D5cb";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formValues, setFormValues] = useState({
    beneficiaryAddress: '',
    arbiterAddress: '',
    depositAmount: '',
  })
  const [approved, setApproved] = useState(false);


  const ContractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain" + chainId);
    if (!ethereum) {
      console.log("You don't have metamask");
      return;
    } else {
      console.log("We have an Ethereum object", ethereum);
    }

    
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised Account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorised account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get metamask");
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      console.log(ethereum);

      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  };



  const handleApprove = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        const provider = new Web3Provider(ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

        const { depositAmount, beneficiaryAddress, arbiterAddress } = formValues;

        //const amount = ethers.utils.parseEther(depositAmount);
        const balance = await provider.getBalance(beneficiaryAddress);
        console.log(`beneficiary Balance: ${ethers.utils.formatEther(balance)}`);
        await contract.transfer(beneficiaryAddress, { value: ethers.utils.parseEther(depositAmount) });


        const tx = await contract.connect(arbiterAddress).approve({
          value: { value: ethers.utils.parseEther(depositAmount) },
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("20", "gwei"),
          to: arbiterAddress
        })
        await tx.wait();

        const isApproved = await contract.isApproved();
        console.log(`Escrow approved: ${isApproved}`);

        const balance1 = await provider.getBalance(arbiterAddress);
        console.log(`Balance of arbiterAddress: ${ethers.utils.formatEther(balance1)}`);

        setApproved(isApproved);
      } else {
        alert("The Escrow was not successful");
      }

    } catch (error) {
      console.log(error);
    }


  }






  //Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      CONNECT TO WALLET
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">ESCROW</p>
          <p className="sub-text">Think trust !! THINK ESCROW</p>

          <form>

            <div className="form-group">
              <label color="white">Beneficiary Address:</label>
              <input
                type="text"
                name="beneficiaryAddress"
                value={formValues.beneficiaryAddress}
                placeholder="beneficiary Address"
                onChange={(e) => setFormValues({ ...formValues, beneficiaryAddress: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Arbiter Address:</label>
              <input
                type="text"
                name="arbiterAddress"
                value={formValues.arbiterAddress}
                placeholder="Arbiter Address"
                onChange={(e) => setFormValues({ ...formValues, arbiterAddress: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Deposit Amount:</label>
              <input
                type="text"
                name="depositAmount"
                value={formValues.depositAmount}
                placeholder="Deposit Amount in Ether"
                onChange={(e) => setFormValues({ ...formValues, depositAmount: e.target.value })}
              />
            </div>

          </form>

          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (approved ? (
            <p>Transaction has been approved!</p>
          ) : (
            <button
              onClick={handleApprove}
              className="cta-button connect-wallet-button"
            >
              APPROVE
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default App;
