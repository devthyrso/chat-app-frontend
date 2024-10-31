import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Chat.css';
import NavBar from '../../components/Navbar/navbar';
import Cookies from 'js-cookie';

const socket = io('http://localhost:7000');

const Chat = () => {
    const loged_user = Cookies.get('userId');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);

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
        if (loged_user) {
            socket.emit('subscribe', `app_chat_user_${loged_user}`);

            socket.on('newMessage', (messageData) => {
                if (messageData.friend_id === selectedFriend?.id) {
                    setMessages((prevMessages) => [...prevMessages, messageData.message]);
                }
            });
        }

        return () => {
            socket.off('newMessage');
        };
    }, [loged_user, selectedFriend]);

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
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="chat-app">
                <div className="users-list">
                    <h3>Usuários</h3>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedFriend(user)}
                            className={`user-item ${selectedFriend?.id === user.id ? 'selected' : ''}`}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>

                {selectedFriend && (
                    <div className="chat-container">
                        <h2>Conversa com {selectedFriend.name}</h2>

                        <div className="chat-popup-body p-3 border-bottom" style={{ overflowY: 'auto', position: 'relative' }}>
                            <ul className="list-inline p-0 mb-0 chat">
                                {messages?.map((msg, index) => {
                                    if (msg.sender_id == loged_user) {
                                        return (
                                            <li className="mt-3 message-box" key={index}>
                                                <div className="text-end">
                                                    <div className="d-inline-block py-2 px-3 bg-primary-subtle chat-popup-message message-right font-size-12 fw-medium" style={{ marginRight: '5px' }}>
                                                        {msg.message}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li className="mt-2" key={`message_${msg.id}`}>
                                                <div className="text-start">
                                                    <div className="d-inline-block py-2 px-3 bg-gray-subtle chat-popup-message font-size-12 fw-medium">
                                                        {msg.message}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        </div>

                        <Form className="message-input-container">
                            <Form.Control
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <Button variant="primary" onClick={sendMessage}>
                                Enviar
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Chat;
