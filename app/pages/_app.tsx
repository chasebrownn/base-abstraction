import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Base AA Project</title>
        <link rel="shortcut icon" href="base.png" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
