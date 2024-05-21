// import React from "react";
import { ConnectButton } from "./web3/ConnectButton";
import { TossContractInteractions } from "./web3/TossInteractions";
import { Game } from "./web3/Game";

function App() {
  return (
    <>
      <div className="flex flex-col w-full h-[100vh] items-center justify-center  bg-[#393D48]">
        <h1 className="text-6xl font-bold text-green-600 m-4  text-center">Green Arrow</h1>
        <ConnectButton   />
        <div>
        <Game/>
          <TossContractInteractions />
        </div>
      </div>
    </>
  );
}

export default App;
