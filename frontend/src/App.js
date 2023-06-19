import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isGeneratePDF, setGeneratePDF] = useState(false);

  const HTTP = "http://localhost:5000/explain-code";

  const handleChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const docDefinition = {
    content: [
      { text: `This is a Audit Report!`, style: "header" },
      { text: `${outputText}`, style: "body" },
    ],

    styles: {
      header: {
        fontSize: 22,
        bold: true,
      },
      body: {
        fontSize: 18,
        bold: false,
      },
    },
  };

  const handleGeneratePDF = async () => {
    const pdfGenerator = pdfMake.createPdf(docDefinition);
    console.log(pdfGenerator);
    pdfGenerator.download();
    setGeneratePDF(false);
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
      {isLoading && (
        <div className="container-output">
          <h2>Your audit report is getting generated...</h2>
        </div>
      )}

      {isGeneratePDF && (
        <div className="container-output">
          <h2>
            Please click the generate PDF button to download the audit report...
          </h2>
        </div>
      )}
      <div className="container">
        <div className="textarea-container">
          <textarea
            className="input-textarea"
            value={inputText}
            onChange={handleChange}
            placeholder="Enter text here..."
          />
        </div>

        {/* {!isLoading && 
        <div className="textarea-container">
          <textarea
            className="output-textarea"
            value={outputText}
            readOnly
            placeholder="Output text will appear here..."
          />
        </div>
        } */}
      </div>

      <div className="button-container">
        {!isGeneratePDF && (
          <button className="submit-button" onClick={handleClick}>
            Submit
          </button>
        )}
        {isGeneratePDF && (
          <button className="submit-button" onClick={handleGeneratePDF}>
            Generate PDF
          </button>
        )}
      </div>
    </>
  );
}

export default App;
