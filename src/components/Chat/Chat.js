import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import CanvasDraw from "react-canvas-draw";


let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [saveableCanvas, setSaveableCanvas] = useState('');

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
                <button
                    onClick={() => {
                        saveableCanvas.undo();
                    }}
                    className="undo"
                >
                    <h3>Undo</h3>
                </button>
                <CanvasDraw
                    canvasWidth="100%"
                    canvasHeight="100%"
                    ref={canvasDraw => (setSaveableCanvas(canvasDraw))}
                    lazyRadius={10}
                    brushRadius={5}
                />
                <button
                    onClick={() => {
                        saveableCanvas.clear();
                    }}
                    className="btn-grad"
                >
                    <h3>Clear</h3>
                </button>
            </div>

        </div>
    )
}

export default Chat;