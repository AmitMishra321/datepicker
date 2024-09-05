import "../src/app/globals.css";
import type { AppProps } from "next/app";
import { TaskProvider } from "../src/app/context/TaskContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TaskProvider>
      <Component {...pageProps} />
    </TaskProvider>
  );
}

export default MyApp;
