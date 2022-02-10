import React, { useEffect, useState } from "react";
import BottleNormal from "../../static/bttle_normal.png";
import { Link } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { safeParseJSON } from "../../Utils/safeParseJSON";
import QRCode from "react-qr-code";
const { REACT_APP_WS_URL } = process.env;
const Display = () => {
  const { sendMessage, lastMessage, readyState } =
    useWebSocket(REACT_APP_WS_URL);
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
    type: "Undetected",
  });
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
          <span class="badge bg-primary text-light">
            {window.location.origin + `/controller`}
          </span>{" "}
          from your PHONE{" "}
        </p>
        <div className="attribution">
          <a href=" https://github.com/IamSAL/sockettle" target="_blank">
            <span class="badge bg-light text-dark">
              https://github.com/IamSAL/sockettle
            </span>
          </a>
        </div>
      </div>
      <div className="details position-fixed top-50">
        <div
          class={`spinner-grow text-${
            connectionStatus == "Open" ? "primary" : "danger"
          }`}
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <h1 style={{ fontSize: "5em" }}>{recievedData.angle}°</h1>
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
          <button type="button" class="btn text-light bg-gradient">
            Back to home
          </button>
        </Link>
      </div>

      <div className="details position-fixed top-50 left-20">
        <h4 className="text-muted">
          Display code <span className="text-white">{displayCode}</span>
        </h4>
      </div>
      <div className="d-flex justify-content-center py-5 bottle">
        <img
          src={BottleNormal}
          alt=""
          srcset=""
          className="w-auto"
          // style={{
          //   transform: `rotate(${
          //     recievedData.type != "custom"
          //       ? recievedData.type == "landscape-primary"
          //         ? 360 - recievedData.angle
          //         : recievedData.type == "landscape-secondary"
          //         ? 90
          //         : recievedData.angle
          //       : recievedData.angle
          //   }deg)`,
          //   transition: recievedData.angle > 90 ? "0.2s" : "unset",
          // }}

          style={{
            transform: `rotate(${
              recievedData.type == "custom"
                ? recievedData.angle
                : recievedData.rotationState?.pitch
            }deg)`,
            transition: "unset",
          }}
        />
      </div>
    </div>
  );
};

export default Display;
