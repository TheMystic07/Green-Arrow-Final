import { type FC, useState } from "react";
import { useSorobanReact } from "@soroban-react/core";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useRegisteredContract } from "@soroban-react/contracts";
// import coinTossgif from "../assets/coin_toss.gif";

function hasReturnValue(result: any): result is { returnValue: StellarSdk.xdr.ScVal } {
  return result && 'returnValue' in result;
}

export const TossContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact();
  const { activeChain, server, address } = sorobanContext;

  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);
  const [tossResult, setTossResult] = useState<string>("");
  const contract = useRegisteredContract("toss");

  const toss = async () => {
    if (!address) {
      console.log("Address is not defined");
      return;
    } else if (!server) {
      console.log("Server is not setup");
      return;
    } else {
      const currentChain = activeChain?.name?.toLocaleLowerCase();
      if (!currentChain) {
        console.log("No active chain");
        return;
      } else {
        setFetchIsLoading(true);

        try {
          const result = await contract?.invoke({
            method: "toss",
            signAndSend: true,
          });

          if (result && hasReturnValue(result)) {
            const result_val = StellarSdk.scValToNative(
              result.returnValue as StellarSdk.xdr.ScVal
            ) as string;
            console.log("Result from contract invocation", result_val);
            setTossResult("Payed");
          } else {
            console.log("No result from contract invocation");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setFetchIsLoading(false);
        }

        // await sorobanContext.connect();
      }
    }
  };

  return (
    <>
      {address ? (
        <div className="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
          {!fetchIsLoading ? (
            <div className="flex flex-col items-center">
              {tossResult && (
                <div className="p-4 border-4 border-solid rounded-md font-bold text-white border-blue-400 text-xl">
                  {tossResult}
                </div>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
                onClick={toss}
              >
                Plant Tree
              </button>
            </div>
          ) : (
            <div>
              <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4" >Paying....</p>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
