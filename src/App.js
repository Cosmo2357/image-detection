import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
/* import "./App.css"; */
import "@tensorflow/tfjs-backend-webgl";
import styles from "./App.module.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  /* const [question, setQuestion] = useState(false); */
  const [robot, setRobot] = useState("");
  const fileInputRef = useRef();
  let imageRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };
  useEffect(() => {
    loadModel();
  }, []);

  const uploadHandler = () => {
    console.log("clicke");
    fileInputRef.current.click();
  };

  const imageOnChangeHandler = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
    /*  setQuestion(true); */
    setRobot("selected");
  };

  const detectImage = async () => {
    /*  setQuestion(false); */
    const results = await model.classify(imageRef.current);
    setResults(results);

    setRobot("answered");
  };

  if (isModelLoading) {
    return (
      <div className={styles.loaderContainer}>
        <h1>Loading...</h1>
        <Loader
          loaded={isModelLoading}
          type="BallTriangle"
          color="rgb(17, 87, 238)"
          height={100}
          width={100}
          timeout={5000} //3 secs
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftUp}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={imageOnChangeHandler}
          />
          <button className={styles.btn} onClick={uploadHandler}>
            SELECT IMAGE
          </button>
        </div>
        <div className={styles.leftBottom}>
          <img src={imageURL} className={styles.image} alt="" ref={imageRef} />
        </div>
      </div>

      <div className={styles.right}>
        <h1 className={styles.robot}>🤖</h1>
        {robot === "" && (
          <p className={styles.pleaseSelect} onClick={uploadHandler}>
            Please select an Image
          </p>
        )}
        {robot === "selected" && (
          <div className={styles.questionButton} onClick={detectImage}>
            IDENTIFY
          </div>
        )}
        {robot === "answered" && (
          <>
            <div className={styles.answer}>
              I'm pretty sure, this is a {results[0].className}!
            </div>
            <p className={styles.pleaseSelect} onClick={uploadHandler}>
              Select another image
            </p>
          </>
        )}

        {/*   {results.length > 0 && (
          <div className="resultsHolder">
            {results.map((result, index) => {
              return (
                <div key={result.className}>
                  <div>{result.className}</div>
                  <div>
                    Confidence level: {(result.probability * 100).toFixed(2)}%
                    {index === 0 && <div className="bestGuess">Best Guess</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App;
