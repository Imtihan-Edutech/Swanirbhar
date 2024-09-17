import { useState, ChangeEvent } from 'react';
import { Input, Button, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseURL } from '../App';

interface ChatBoxProps {
    onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleQuerySubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post<{ text: string }>(`${baseURL}/course-details`, { query });
            setMessages(response.data.text);
        } catch (error) {
            console.error('An error occurred while fetching response:', error);
            setMessages('An error occurred while fetching response.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Ask to AI</h3>
                <CloseCircleOutlined onClick={onClose} className="close-btn" />
            </div>
            <div className="input-container">
                <Input 
                    placeholder="Please ask your question" 
                    value={query}
                    onChange={handleInputChange}
                    onPressEnter={handleQuerySubmit}
                    style={{ width: 'calc(100% - 65px)', marginRight: '8px' }}
                />
                <Button type="primary" onClick={handleQuerySubmit}>
                    Ask
                </Button>
            </div>
            <div className="message-container">
                {loading ? <Spin className="loading-spinner-1" /> : <p>{messages}</p>}
            </div>
        </div>
    );
};

export default ChatBox;
