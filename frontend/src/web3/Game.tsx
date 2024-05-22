// import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export const Game = () => {
    const { unityProvider ,  loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "/Build/GreenArrow.loader.js",
        dataUrl: "/Build/GreenArrow.data",
        frameworkUrl: "/Build/GreenArrow.framework.js",
        codeUrl: "/Build/GreenArrow.wasm",
      });
    
      return (
        <>
          {!isLoaded && (
            <p className="text-6xl text-white text-center m-2 p-2 " >Loading Application... {Math.round(loadingProgression * 100)}%</p>
          )}
          <Unity
            unityProvider={unityProvider}
            className="w-[70vw] rounded-2xl "
            style={{ visibility: isLoaded ? "visible" : "hidden" }}
          />
        </>
      );
    }


