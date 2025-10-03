import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    Flex,
    Card,
    CardBody,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { EmailIcon, StarIcon, ViewIcon } from '@chakra-ui/icons';

const HomePage = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');

    const features = [
        {
            icon: ViewIcon,
            title: 'Канбан доски',
            description: 'Организуйте свои задачи с помощью интуитивных канбан досок'
        },
        {
            icon: StarIcon,
            title: 'Управление задачами',
            description: 'Создавайте, редактируйте и отслеживайте прогресс задач'
        },
    ];

    return (
        <Box minH="100vh" bg={bgColor}>
            {/* Hero Section */}
            <Box bg="blue.600" color="white" py={20}>
                <Container maxW="container.xl">
                    <VStack spacing={6} textAlign="center">
                        <Heading
                            size="lg"
                        >
                            🎯 IKD - Internet Kanban Desk
                        </Heading>
                        <Text fontSize="xl" maxW="2xl">
                            Современная канбан доска для управления вашими проектами и задачами.
                            Начните организовывать свою работу уже сегодня!
                        </Text>
                        <Flex gap={4} mt={4} flexWrap="wrap" justify="center">
                            <Button
                                as={Link}
                                to="/register"
                                colorScheme="white"
                                variant="outline"
                                size="lg"
                                _hover={{ bg: 'white', color: 'blue.600' }}
                            >
                                Начать бесплатно
                            </Button>
                            <Button
                                as={Link}
                                to="/login"
                                colorScheme="white"
                                variant="solid"
                                size="lg"
                                bg="white"
                                color="blue.600"
                                _hover={{ bg: 'gray.100' }}
                            >
                                Войти
                            </Button>
                        </Flex>
                    </VStack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxW="container.xl" py={16}>
                <VStack spacing={12}>
                    <Heading textAlign="center">Возможности IKD</Heading>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
                        {features.map((feature, index) => (
                            <Card key={index} bg={cardBg} boxShadow="lg" height="100%">
                                <CardBody>
                                    <VStack spacing={4} textAlign="center" height="100%">
                                        <Box
                                            p={3}
                                            bg="blue.100"
                                            color="blue.600"
                                            borderRadius="full"
                                        >
                                            <feature.icon boxSize={6} />
                                        </Box>
                                        <Heading size="md">{feature.title}</Heading>
                                        <Text color="gray.600" flex="1">
                                            {feature.description}
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    {/* CTA Section */}
                    <Card bg="blue.50" border="1px" borderColor="blue.200" w="full">
                        <CardBody>
                            <VStack spacing={6} textAlign="center" py={8}>
                                <Heading size="lg" color="blue.700">
                                    Готовы начать?
                                </Heading>
                                <Text fontSize="lg" color="blue.600" maxW="2xl">
                                    Присоединяйтесь к тысячам пользователей, которые уже используют IKD
                                    для организации своих учебных проектов и повышения продуктивности.
                                </Text>
                                <Button
                                    as={Link}
                                    to="/register"
                                    colorScheme="blue"
                                    size="lg"
                                    px={8}
                                >
                                    Создать аккаунт
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </Box>
    );
};

export default HomePage;
