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
    InputRightElement,
    FormErrorMessage,
    Container
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтверждение пароля обязательно';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/auth/register', {
                email: formData.email,
                password: formData.password
            });

            toast.success('Регистрация успешна! Теперь войдите в систему.');
            navigate('/login');
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Ошибка регистрации. Попробуйте еще раз.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <Box display="flex" alignItems="center" justifyContent="center" minH="80vh">
                <Card w="full" maxW="md" boxShadow="xl">
                    <CardBody>
                        <VStack spacing={6}>
                            <Heading size="lg" textAlign="center" color="blue.600" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                                Создать аккаунт
                            </Heading>

                            <Alert status="info" borderRadius="md" variant="left-accent">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Уже есть аккаунт?</AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        Используйте демо доступ: admin@kanban.ru / admin123
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <VStack spacing={4}>
                                    <FormControl isInvalid={errors.email}>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type="email"
                                                placeholder="Введите ваш email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                leftElement={<EmailIcon color="gray.300" ml={3} />}
                                                pl={10}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={errors.password}>
                                        <FormLabel>Пароль</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Не менее 6 символов"
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
                                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={errors.confirmPassword}>
                                        <FormLabel>Подтверждение пароля</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Повторите пароль"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                leftElement={<LockIcon color="gray.300" ml={3} />}
                                                pl={10}
                                            />
                                            <InputRightElement width="4.5rem" mr={1}>
                                                <Button
                                                    h="1.75rem"
                                                    size="sm"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    variant="ghost"
                                                >
                                                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        size="lg"
                                        w="full"
                                        isLoading={loading}
                                        loadingText="Регистрация..."
                                        bgGradient="linear(to-r, blue.400, purple.500)"
                                        _hover={{
                                            bgGradient: 'linear(to-r, blue.500, purple.600)',
                                            transform: 'translateY(-2px)'
                                        }}
                                        transition="all 0.2s"
                                    >
                                        Создать аккаунт
                                    </Button>
                                </VStack>
                            </form>

                            <Text textAlign="center" color="gray.600">
                                Уже есть аккаунт?{' '}
                                <Link to="/login">
                                    <Button variant="link" colorScheme="blue" color="blue.500">
                                        Войти здесь
                                    </Button>
                                </Link>
                            </Text>
                        </VStack>
                    </CardBody>
                </Card>
            </Box>
        </Container>
    );
};

export default Register;
