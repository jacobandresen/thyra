import Head from "next/head";
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./index.module.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


export default function Home() {
  const [storyInput, setStoryInput] = useState("");
  const [result, setResult] = useState();

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  async function onSubmit(event) {
    event.preventDefault();
    try {

      setLoading(true);
      setResult("");

      const response = await fetch("/thyra/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story: storyInput }),
      });
      setLoading(false);

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Dronning Thyra</title>
        <link rel="icon" href="/thyra/Thyra.jpg" />
      </Head>

      <main className={styles.main} >
        <img src="/thyra/thyra.jpg" className={styles.icon} />
        <h3>Dronning Thyra</h3>
        Fortæl mig en historie om:
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="emne"
            placeholder="Emne"
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
          />
          
          <input type="submit" value="Fortæl" />
        </form>



        <div className="sweet-loading">
        <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
          
          {result}</div>
      </main>
    </div>
  );
}
