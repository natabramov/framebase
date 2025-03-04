import { createGlobalStyle } from "styled-components";
import { StateContext } from "/context/StateContext";
import { useEffect, useState } from "react";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;


export default function App({ Component, pageProps }) {
  // for hydration issue
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
    return (
            <>
            <GlobalStyle />
            <StateContext>
            {isClient && <Component {...pageProps} />}
            </StateContext>
            </>
    );
}
