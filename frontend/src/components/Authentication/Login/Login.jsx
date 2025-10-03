import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    Card,
    CardBody,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', formData.email);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setUser({ token: response.data.token, email: formData.email });

            toast.success('Добро пожаловать!');
        } catch (error) {
            toast.error('Ошибка входа. Проверьте логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4}>
            <Card maxW="md" w="full" boxShadow="xl">
                <CardBody>
                    <VStack spacing={6}>
                        <Heading size="lg" textAlign="center" color="blue.600" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                            Вход в систему
                        </Heading>

                        <Alert status="info" borderRadius="md" variant="left-accent">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>Демо доступ:</AlertTitle>
                                <AlertDescription fontSize="sm">
                                    Почта: admin@kanban.ru<br />
                                    Пароль: admin123
                                </AlertDescription>
                            </Box>
                        </Alert>

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Почта</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type="email"
                                            placeholder="Введите почту"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            leftElement={<EmailIcon color="gray.300" ml={3} />}
                                            pl={10}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Пароль</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Введите пароль"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            leftElement={<LockIcon color="gray.300" ml={3} />}
                                            pl={10}
                                        />
                                        <InputRightElement width="4.5rem" mr={1}>
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                                variant="ghost"
                                            >
                                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    w="full"
                                    isLoading={loading}
                                    loadingText="Вход..."
                                    bgGradient="linear(to-r, blue.400, purple.500)"
                                    _hover={{
                                        bgGradient: 'linear(to-r, blue.500, purple.600)',
                                        transform: 'translateY(-2px)'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Войти
                                </Button>
                            </VStack>
                        </form>

                        <Text textAlign="center" color="gray.600">
                            Нет аккаунта?{' '}
                            <Link to="/register">
                                <Button variant="link" colorScheme="blue" color="blue.500">
                                    Зарегистрироваться
                                </Button>
                            </Link>
                        </Text>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default Login;
