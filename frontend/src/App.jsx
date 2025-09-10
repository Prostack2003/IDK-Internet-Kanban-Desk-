import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, Text, Spinner, Avatar, Container } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { toast } from 'sonner';
import Login from './components/Authentication/Login/Login.jsx';
import Register from './components/Authentication/Register/Register.jsx';
import KanbanBoard from './components/KanbanBoard/KanbanBoard.jsx';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        if (token && userEmail) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ token, email: userEmail });
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        toast.success('Вы успешно вышли из системы');
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Router>
            <Box minW="max" minH="100vh" bg="gray.50">
                {user && (
                    <Box bg="white" boxShadow="sm" borderBottom="1px" borderColor="gray.200">
                        <Container maxW="container.xl">
                            <Flex
                                as="nav"
                                justify="space-between"
                                align="center"
                                py={4}
                            >
                                <Heading size="lg" color="blue.600">
                                    🎯  IKD (Internet Kanban Desk)
                                </Heading>

                                <Flex align="center" gap={4}>
                                    <Flex
                                        align="center"
                                        gap={3}
                                        bg="blue.50"
                                        px={4}
                                        py={2}
                                        borderRadius="full"
                                    >
                                        <Avatar size="sm" name={user.email} bg="blue.500" color="white" />
                                        <Text fontSize="sm" fontWeight="medium" color="blue.700">
                                            {user.email}
                                        </Text>
                                    </Flex>

                                    <Button
                                        onClick={handleLogout}
                                        colorScheme="red"
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<EmailIcon />}
                                    >
                                        Выйти
                                    </Button>
                                </Flex>
                            </Flex>
                        </Container>
                    </Box>
                )}

                <Box as="main" flex="1">
                    <Routes>
                        <Route
                            path="/login"
                            element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/register"
                            element={!user ? <Register /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/"
                            element={user ? <KanbanBoard /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;
