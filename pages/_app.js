import { createGlobalStyle } from "styled-components";
import { Inter } from "next/font/google";
import { StateContext } from "/context/StateContext"

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });

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
    return (
        <>
            <GlobalStyle />
            <StateContext>
              <main className={inter.variable}>
                  <Component {...pageProps} />
              </main> 
            </StateContext>
        </>
    );
}
