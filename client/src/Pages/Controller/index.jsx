import React, { useEffect, useState } from "react";
import { CircleSlider } from "react-circle-slider";
import { Link, useLocation } from "react-router-dom";
import { useEffectOnce, useOrientation, useWindowSize } from "react-use";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { mapRange } from "../../Utils/clamp";
import { Modal, Button, Form } from "react-bootstrap";
const { REACT_APP_WS_URL } = process.env;
const Controller = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } =
    useWebSocket(REACT_APP_WS_URL);
  const [displayCode, setdisplayCode] = useState(null);
  const [show, setShow] = useState(true);
  const [customInput, setcustomInput] = useState(0);
  const [inputMode, setinputMode] = useState("custom");
  const handleClose = () => {
    if (displayCode?.length == 4) {
      setShow(false);
    } else {
      alert("You must give a 4 digit display code.");
    }
  };

  const orientation = useOrientation();
  const { width: deviceWidth } = useWindowSize();
  const location = useLocation();
  useEffect(() => {
    sendMessage(
      JSON.stringify({
        method: "orientation",
        payload: { ...orientation, time: Date.now(), displayCode },
      })
    );

    return () => {};
  }, [orientation]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const passedCode = query.get("displayCode");
    if (passedCode?.length == 4) {
      setdisplayCode(passedCode);
      setShow(false);
    }
    return () => {};
  }, [location]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  function handleCustomInput(val) {
    setcustomInput(val);
    sendMessage(
      JSON.stringify({
        method: "orientation",
        payload: {
          type: "Custom",
          angle: customInput,
          time: Date.now(),
          displayCode,
        },
      })
    );
  }
  return (
    <>
      <div
        className="controller container"
        style={{ overflow: "hidden", maxHeight: "99vh" }}
      >
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter 4 digit Display code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              required
              value={displayCode}
              className="form input form-control"
              placeholder="4 digit display code"
              onChange={(e) => setdisplayCode(e.target.value || "")}
            />
            <p> (Open display in another screen to find the 4 digit code.)</p>
          </Modal.Body>
          <Modal.Footer>
            <Link to="/">
              <button type="button" class="btn text-light bg-gradient">
                Back to home
              </button>
            </Link>
            <Button variant="primary" onClick={handleClose}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="details position-absolute">
          <h1 style={{ fontSize: "3em" }}>{orientation.angle}°</h1>
          <h3>{orientation.type.toUpperCase()}</h3>
          <h5 className="text-muted">
            Controlling{" "}
            <span
              onClick={() => setShow(true)}
              className="text-white cursor-pointer"
            >
              {displayCode}
            </span>{" "}
            | {connectionStatus}
          </h5>
          <div className="mode py-2">
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={inputMode == "custom"}
              label={`Custom input`}
              onChange={(e) => {
                if (e.target.checked) {
                  setinputMode("custom");
                } else {
                  setinputMode("rotation");
                }
              }}
            />
          </div>
          <div className="postion-absolute mt-1">
            <Link to="/">
              <button type="button" class="btn text-light bg-gradient">
                Back to home
              </button>
            </Link>
          </div>
        </div>
        <div className="row pt-5 mt-2  ">
          <CircleSlider
            value={customInput}
            onChange={handleCustomInput}
            className="customCircle"
            max={360}
            min={0}
            size={320}
            disabled={inputMode != "custom"}
            knobColor={inputMode == "custom" ? "blue" : "gray"}
            // circleWidth={8}
            // progressWidth={8}
          ></CircleSlider>
          {inputMode == "custom" && (
            <h1
              style={{
                fontSize: "2em",
                color: "blue",
                position: "fixed",
                bottom: "30px",
              }}
            >
              {customInput}°
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Controller;
