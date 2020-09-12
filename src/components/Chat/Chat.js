import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import CanvasDraw from "react-canvas-draw";
import Slider from '@material-ui/core/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { green, red, blue, purple, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';

const GreenRadio = withStyles({
    root: {
        color: green[500],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const BlueRadio = withStyles({
    root: {
        color: blue[500],
        '&$checked': {
            color: blue[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
    root: {
        color: red[500],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const BlackRadio = withStyles({
    root: {
        color: grey[800],
        '&$checked': {
            color: grey[900],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const PurpleRadio = withStyles({
    root: {
        color: purple[500],
        '&$checked': {
            color: purple[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [saveableCanvas, setSaveableCanvas] = useState('');
    const [value, setValue] = useState(3);
    const [curColor, setCurColor] = useState(purple[600]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleColorChange = (event) => {
        setCurColor(event.target.value);
    };


    const ENDPOINT = 'https://interview-lelo.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                do {
                    alert(error + " Go back, & please take another Username");
                } while (error);
            }
        });

        return () => {
            socket.emit("disconnect");
            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>

            <div className="canvas">
                <CanvasDraw
                    canvasWidth="100%"
                    canvasHeight="100%"
                    ref={canvasDraw => (setSaveableCanvas(canvasDraw))}
                    lazyRadius={value}
                    brushRadius={value}
                    brushColor={curColor}
                    catenaryColor={curColor}
                />
            </div>

            <div className="slide">
                <div className="buttons">
                    <IconButton aria-label="undo" color="primary" onClick={() => {
                        saveableCanvas.undo();
                    }}>
                        <UndoIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="secondary" onClick={() => {
                        saveableCanvas.clear();
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </div>

                <div className="picker">
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="color" name="color" value={curColor} onChange={handleColorChange}>
                            <FormControlLabel value={purple[600]} control={<PurpleRadio />} />
                            <FormControlLabel value="red" control={<RedRadio />} />
                            <FormControlLabel value={blue[600]} control={<BlueRadio />} />
                            <FormControlLabel value={green[600]} control={<GreenRadio />} />
                            <FormControlLabel value="black" control={<BlackRadio />} />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="slider">
                    <Slider value={value} min={0.5} max={15} orientation="vertical" onChange={handleChange} aria-labelledby="continuous-slider" />

                </div>
            </div>

        </div>
    )
}

export default Chat;