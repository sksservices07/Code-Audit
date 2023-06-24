import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Lottie from "lottie-react";
import submit from "./assets/submit.json";
import docLoad from "./assets/docLoad.json";
import analyze from "./assets/analyze.json";
import download from "./assets/download.json";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isGeneratePDF, setGeneratePDF] = useState(false);
  const [isDownload, setDownload] = useState(false);

  const HTTP = "http://localhost:5000/explain-code";

  const handleChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const docDefinition = {
    content: [{ text: `${outputText}`, style: "body" }],

    styles: {
      body: {
        fontSize: 18,
        bold: false,
      },
    },
  };

  const handleGeneratePDF = async () => {
    setDownload(true);
    const pdfGenerator = pdfMake.createPdf(docDefinition);
    console.log(pdfGenerator);
    pdfGenerator.download();
    setInputText("");
    await setInterval(() => {
      setDownload(false);
      setGeneratePDF(false);
    }, 3000);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      console.log(inputText);
      await axios
        .post(`${HTTP}`, { prompt: inputText })
        .then((res) => {
          console.log(res);
          console.log(res.data.data);
          setOutputText(res.data.data);
          setGeneratePDF(true);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error sending input data to backend:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container">
        {isLoading && !isGeneratePDF && (
          <div className="container-output">
            <div>
              <h2>Your audit report is generating...</h2>
            </div>
            <div className="container-lottie">
              <Lottie animationData={docLoad} />
            </div>
          </div>
        )}
        {!isLoading && isGeneratePDF && (
          <div className="container-output">
            <div className="container-text">
              <h2>
                Please click the button below to download the audit report...
              </h2>
            </div>
            <div className="container-lottie-analyze">
              <Lottie animationData={analyze} />
            </div>
          </div>
        )}

        {!isLoading && !isGeneratePDF && (
          <div className="textarea-container">
            <textarea
              className="input-textarea"
              value={inputText}
              onChange={handleChange}
              placeholder="Enter your code here..."
            />
          </div>
        )}
      </div>

      <div className="button-container ">
        {!isGeneratePDF && !isLoading && !isDownload && (
          <button className="submit-button" onClick={handleClick}>
            Submit
          </button>
        )}
        {!isGeneratePDF && isLoading && !isDownload && (
          <div className="container-lottie-submit">
            <Lottie animationData={submit} loop={false} />
          </div>
        )}
        {isGeneratePDF && !isLoading && !isDownload && (
          <button className="submit-button" onClick={handleGeneratePDF}>
            Generate PDF
          </button>
        )}
        {isGeneratePDF && !isLoading && isDownload && (
          <div className="container-lottie-download">
            <Lottie animationData={download} loop={false} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
