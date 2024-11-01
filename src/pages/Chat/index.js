import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Chat.css';
import NavBar from '../../components/Navbar/navbar';
import Cookies from 'js-cookie';
import { BsChatLeftText } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Chat = () => {
    const loged_user = Cookies.get('userId');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        socket.current = io('http://localhost:7000');
        socket.current.on('connect', () => {
            socket.current.emit('subscribe', `app_chat_user_${loged_user}`);
        });

        socket.current.on('newMessage', (messageData) => {
            if (messageData.friend_id == selectedFriend?.id) {
                setMessages((prevMessages) => [...prevMessages, messageData.message]);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [loged_user, selectedFriend]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data.users);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedFriend) {
            const fetchMessages = async () => {
                try {
                    const response = await api.get(`/api/chat/${selectedFriend.id}`);
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error('Erro ao carregar mensagens:', error);
                }
            };
            fetchMessages();
        }
    }, [selectedFriend]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const response = await api.post('/api/chat/store', {
                sender_id: loged_user,
                message: newMessage,
                type: 'text',
                receiver_id: selectedFriend.id
            });

            setMessages((prevMessages) => [...prevMessages, response.data.message]);
            setNewMessage('');

            socket.current.emit('sendMessage', {
                receiver_id: selectedFriend.id,
                friend_id: loged_user,
                message: response.data.message
            });
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    };

    return (
        <>
            <NavBar />

            <div id='divContainer' className='container'>

                <div className='headerContainer'>
                    <div className='divheaderTittleMobile'>
                        <div id='divHeaderTittle'><BsChatLeftText className='fs-3 ms-2' /><h3 id='tittleH2'> Conversas</h3></div>
                    </div>
                </div>

                <div className="chat-app container mt-2">
                    <div className="users-list shadowCustom">
                        <h4 className='ms-2 d-flex align-items-center gap-1'><FiUsers /><span>Usuários</span></h4>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedFriend(user)}
                                className={`user-item border shadowCustom rounded-1 m-1 p-2 ${selectedFriend?.id === user.id ? 'selected' : 'noSelected'}`}
                            >
                                <div className='d-flex align-items-center gap-1'><FaUserCircle className='text-primary' />{user.name}</div>
                            </div>
                        ))}
                    </div>

                    {selectedFriend && (
                        <div className="chat-container border border-1 rounded-2 p-1 shadowCustom">
                            <h5 className='ps-2 pt-2 pb-2 border-bottom'>Conversa com {selectedFriend.name}</h5>

                            <div className="chat-popup-body p-2" style={{ overflowY: 'auto', maxHeight: '400px', position: 'relative' }}>
                                <ul className="list-inline p-0 mb-0 chat">
                                    {messages?.map((msg, index) => (
                                        <li className="mt-3 message-box" key={index}>
                                            <div className={`text-${msg.sender_id == loged_user ? 'end' : 'start'}`}>
                                                <div
                                                    className={`d-inline-block rounded rounded-2 py-2 px-2 ${msg.sender_id == loged_user ? 'bg-primary-subtle text-black' : 'bg-body-secondary text-black'} chat-popup-message font-size-12 fw-medium`}
                                                    style={msg.sender_id == loged_user ? { marginRight: '5px' } : {}}
                                                >
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </ul>
                            </div>


                            <Form className="message-input-container border-top pt-2">
                                <Form.Control
                                    className='ms-2 mb-2 me-2 shadowCustom'
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <Button className='ms-2 mb-2 me-2 shadowCustom' variant="primary" onClick={sendMessage}>
                                    Enviar
                                </Button>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;
