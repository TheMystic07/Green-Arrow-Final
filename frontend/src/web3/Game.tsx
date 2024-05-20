import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export const Game = () => {
    const { unityProvider } = useUnityContext({
        loaderUrl: "/Build/GreenArrow.loader.js",
        dataUrl: "/Build/GreenArrow.data",
        frameworkUrl: "/Build/GreenArrow.framework.js",
        codeUrl: "/Build/GreenArrow.wasm",
      });
    
      return <Unity unityProvider={unityProvider}  className="w-[80vw]" />;
    }
