import React, { useEffect, useState } from "react";
import { CircleSlider } from "react-circle-slider";
import { Link, useLocation } from "react-router-dom";
import { useMotion, useOrientation, useWindowSize } from "react-use";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { mapRange } from "../../Utils/clamp";
import { Modal, Button, Form } from "react-bootstrap";
import _ from "lodash";
import { accelDenoise } from "./../../Utils/accelDenoise";
import { useAbsOrientation } from "./../../Utils/useAbsOrientation";
const { REACT_APP_WS_URL } = process.env;
const Controller = () => {
  const [socketUrl, setSocketUrl] = useState(REACT_APP_WS_URL);
  const quaternion = useAbsOrientation();
  const { sendMessage, lastMessage, readyState } =
    useWebSocket(socketUrl);
  const [displayCode, setdisplayCode] = useState(null);
  const [show, setShow] = useState(true);
  const [debugShow, setdebugShow] = useState(false);
  const [customInput, setcustomInput] = useState(0);
  const [inputMode, setinputMode] = useState("quaternion");
  const handleClose = () => {
    if (displayCode?.length == 4) {
      setShow(false);
    } else {
      alert("You must give a 4 digit display code.");
    }
  };
  const handleDebugClose = () => {
    setdebugShow(false)
  };
  const motionState = useMotion();
  const [rotationState, setrotationState] = useState({});
  const orientation = useOrientation();

  const location = useLocation();
  useEffect(() => {
    if (!inputMode || inputMode == "quaternion") {
      sendMessage(
        JSON.stringify({
          method: "orientation",
          payload: {
            ...orientation,
            type:"quaternion",
            custom:"HELLO",
            time: Date.now(),
            displayCode,
            quaternion,
          },
        })
      );
    }

    return () => {
      // ()=> setSocketUrl(null)
    };
  }, [orientation, quaternion, sendMessage, displayCode, inputMode]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const passedCode = query.get("displayCode");
    if (passedCode?.length == 4) {
      setdisplayCode(passedCode);
      setShow(false);
    }
    return () => {};
  }, [location]);

  useEffect(() => {
    if (motionState?.acceleration) {
      const { x, y, z } = motionState.accelerationIncludingGravity;
      const pitch = ((Math.atan2(z, -y) * 180) / Math.PI)
      const roll = ((Math.atan2(x, -y) * 180) / Math.PI)
      const yaw = ((Math.atan2(-x, -z) * 180) / Math.PI)
      const result = { pitch, roll, yaw };
      setrotationState({ ...result, acc: {x, y, z } });
    }

    return () => {};
  }, [motionState]);

  useEffect(() => {
    if (inputMode == "accelero") {
      sendMessage(
        JSON.stringify({
          method: "orientation",
          payload: {
            ...orientation,
            type:"accelero",
            custom:"HELLO",
            time: Date.now(),
            displayCode,
            rotationState,
          },
        })
      );
    }
    return () => {};
  }, [rotationState, inputMode, sendMessage, displayCode, orientation]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  function handleCustomInput(val) {
    setcustomInput(()=>{
      if(val<360 && val>=0){
        return val
      }else if (val>359){
        return 360
      }else{
        return 0
      }
    });
    if (inputMode == "custom") {
      sendMessage(
        JSON.stringify({
          method: "orientation",
          payload: {
            type: "custom",
            angle: customInput,
            custom:"HELLO",
            time: Date.now(),
            displayCode,
          },
        })
      );
    }
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
          {/* <h1 style={{ fontSize: "3em" }}>
            {inputMode == "custom" ? customInput?.toFixed(4) : 0}
          </h1> */}
          {/* <h3>{orientation.type.toUpperCase()}</h3> */}
          <h5 className="text-muted">
            Controlling{" "}
            <span
              onClick={() => setShow(true)}
              className="text-white cursor-pointer"
            >
              {displayCode}
            </span>{" "}
            |  <span
            className={`text-${
              connectionStatus == "Open" ? "primary" : "danger"
            }`}
          >
            {connectionStatus}
          </span>
          </h5>
          <div className="mode py-2">
            <div className="mb-3">
              <Form.Check
                inline
                label="1"
                name="group1"
                checked={inputMode == "quaternion"}
                label={`quaternion`}
                onChange={(e) => {
                  if (e.target.checked) {
                    setinputMode("quaternion");
                  }
                }}
              />
              <Form.Check
                inline
                label="2"
                name="group1"
                checked={inputMode == "accelero"}
                label={`Accelero`}
                onChange={(e) => {
                  if (e.target.checked) {
                    setinputMode("accelero");
                  }
                }}
              />
              <Form.Check
                inline
                checked={inputMode == "custom"}
                label={`Custom input`}
                onChange={(e) => {
                  if (e.target.checked) {
                    setinputMode("custom");
                  }
                }}
              />
            </div>

            {/* <Form.Check
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
            /> */}
          </div>
          <div className="postion-absolute mt-1">
            <Link to="/">
              <button type="button" class="btn text-light bg-gradient">
                Back to home
              </button>
            </Link>
           
          </div>
          {/* <pre>{JSON.stringify(rotationState, null, 2)}</pre> */}
        </div>
        <div className="row pt-5 mt-2  ">
          <CircleSlider
            value={customInput}
            onChange={handleCustomInput}
            className="customCircle"
            max={365}
            stepSize={1}
            min={-5}
            size={320}
            disabled={inputMode != "custom"}
            knobColor={inputMode == "custom" ? "blue" : "gray"}
            // circleWidth={8}
            // progressWidth={8}
          ></CircleSlider>
        <div className="row d-flex " style={{ position: "fixed",
                bottom: "30px",}}>
          
          <div className="col">
          <button type="button" class="btn text-light bg-gradient" onClick={()=>setdebugShow(true)}>Debug</button>
          
          </div>
          <div className="col">
          {inputMode == "custom" && (
            <h1
              style={{
                fontSize: "1.4em",
                color: "blue",
               
              }}
            >
              {Math.floor(customInput)}
            </h1>
           
          )}
           
          </div>
          <div className="col">
          {
              (["Connecting","Uninstantiated","Closing",""].includes(connectionStatus) || !connectionStatus)&& <button type="button" class="btn text-light bg-gradient" >
             <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
            
 
            </button>}
            {
              connectionStatus=="Open" && <button type="button" class="btn text-light bg-gradient" onClick={()=>setSocketUrl(null)}>
             
            
  Disconnect
            </button>}{ connectionStatus=="Closed" && <button type="button" class="btn text-light bg-gradient" onClick={()=>setSocketUrl(REACT_APP_WS_URL)}>
        
                Reconnect
              </button>
            }
          </div>
        </div>
         
           
           <Modal show={debugShow} onHide={handleDebugClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Motion sensors</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <pre>{JSON.stringify({...motionState,...rotationState}, null, 2)}</pre>
          </Modal.Body>
          <Modal.Footer>
         
            <Button variant="light" onClick={handleDebugClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
      </div>
    </>
  );
};

export default Controller;
