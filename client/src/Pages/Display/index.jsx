import React, { useEffect, useState } from "react";
import BottleNormal from "../../static/bttle_normal.png";
import { Link } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { safeParseJSON } from "../../Utils/safeParseJSON";
import QRCode from "react-qr-code";
import ThreeModel from "../../Components/ThreeModel";
import { Canvas } from "@react-three/fiber";

const { REACT_APP_WS_URL } = process.env;
const Display = () => {
  const [socketUrl, setSocketUrl] = useState(REACT_APP_WS_URL);
  const { sendMessage, lastMessage, readyState } =
    useWebSocket(socketUrl);
  const [displayCode, setdisplayCode] = useState(
    Math.floor(1000 + Math.random() * 9000)
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const [recievedData, setrecievedData] = useState({
    angle: 0,
    type: "custom",
  });

  const [Model, setModel] = useState(null);
  useEffect(() => {
    if (lastMessage) {
      const parsedMsg = safeParseJSON(lastMessage?.data);
      if (parsedMsg?.payload && parsedMsg?.payload.displayCode == displayCode) {
        setrecievedData({
          ...parsedMsg.payload,
          ping: Date.now() - parsedMsg.payload.time,
        });
      }
    }

    return () => {};
  }, [lastMessage]);


  

  return (
    <div className="display container">
      <div className="qr-code text-center shadow-lg">
        <h4>{displayCode}</h4>
        <QRCode
          value={
            window.location.origin + `/controller?displayCode=${displayCode}`
          }
          size={200}
        />
        <p className="w-75 text-center m-auto">
          Scan the QR code, or go to{" "}
          <span className="badge bg-primary text-light">
            {window.location.origin + `/controller`}
          </span>{" "}
          from your PHONE{" "}
        </p>
        <div className="attribution">
          <a href=" https://github.com/IamSAL/sockettle" target="_blank">
            <span className="badge bg-light text-dark">
              https://github.com/IamSAL/sockettle
            </span>
          </a>
        </div>
      </div>
      <div className="details position-fixed top-50">
        <div
          className={`spinner-grow text-${
            connectionStatus == "Open" ? "primary" : "danger"
          }`}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h1 style={{ fontSize: "5em" }}>
          {recievedData.type == "custom" ? recievedData.angle + "??" : "XYZW"}
        </h1>
        <span className="text-muted">{recievedData.quaternion?.map(q=>q.toFixed(4)).join(",")}</span>
        <h3>{recievedData.type?.toUpperCase()}</h3>
        <h5 className="text-muted">
          Connection{" "}
          <span
            className={`text-${
              connectionStatus == "Open" ? "primary" : "danger"
            }`}
          >
            {connectionStatus}
          </span>{" "}
          |{" "}
          {recievedData.ping && (
            <span>
              {" "}
              Ping{" "}
              <span
                className={`text-${
                  recievedData.ping <= 320 ? "primary" : "danger"
                }`}
              >
                {recievedData.ping}
              </span>
            </span>
          )}
        </h5>

        <Link to="/">
          <button type="button" className="btn text-light bg-gradient">
            Back to home
          </button>
        </Link>
        {
              (["Connecting","Uninstantiated","Closing",""].includes(connectionStatus) || !connectionStatus)&& <button type="button" className="btn text-light bg-gradient mx-2" >
             <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
            
 Loading
            </button>}
            {
              connectionStatus=="Open" && <button type="button" className="btn text-light bg-gradient mx-2" onClick={()=>setSocketUrl(null)}>
             
            
  Disconnect
            </button>}{ connectionStatus=="Closed" && <button type="button" className="btn text-light bg-gradient mx-2" onClick={()=>setSocketUrl(REACT_APP_WS_URL)}>
        
                Reconnect
              </button>
            }
      </div>

      <div className="details position-fixed top-50 left-20">
        <h4 className="text-muted">
          Display code <span className="text-white">{displayCode}</span>
        </h4>
      </div>
      <div className="w-100 h-100">
        <Canvas
          width="100vw"
          height="100vh"
          style={{ height: "100vh", display: "block" }}
          camera={{
            fov: 35,
            position: [4, 50, 235],
            height: 2200,
            width: 6200,
            bottom: 1900,
          }}
        >
          <ThreeModel
            setModel={setModel}
            Model={Model}
            recievedData={recievedData}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Display;
