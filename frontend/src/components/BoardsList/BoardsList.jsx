import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardBody,
    Heading,
    Button,
    VStack,
    Text,
    Spinner,
    Container,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Textarea
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BoardsList = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBoard, setNewBoard] = useState({ name: '', description: '' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/boards');
            setBoards(response.data);
        } catch (error) {
            toast.error('Ошибка загрузки досок');
        } finally {
            setLoading(false);
        }
    };

    const createBoard = async (e) => {
        e.preventDefault();
        if (!newBoard.name.trim()) {
            toast.error('Введите название доски');
            return;
        }

        try {
            const response = await axios.post('/api/boards', newBoard);
            setBoards([...boards, response.data]);
            setNewBoard({ name: '', description: '' });
            onClose();
            toast.success('Доска создана!');
        } catch (error) {
            toast.error('Ошибка создания доски');
        }
    };

    if (loading) {
        return (
            <Container maxW="container.xl" py={8}>
                <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
                    <Spinner size="xl" />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                    {boards.map((board) => (
                        <Card
                            key={board.id}
                            bg="blue.50"
                            borderWidth={2}
                            borderColor="blue.200"
                            cursor="pointer"
                            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                            onClick={() => navigate(`/board/${board.id}`)}
                        >
                            <CardBody textAlign="center">
                                <Heading size="md" mb={2}>{board.name}</Heading>
                                <Text color="gray.600" noOfLines={2}>{board.description}</Text>
                                <Text fontSize="sm" color="gray.400" mt={2}>
                                    Создано: {new Date(board.created_at).toLocaleDateString('ru-RU')}
                                </Text>
                            </CardBody>
                        </Card>
                    ))}
                </Grid>
                <Box textAlign="center">
                    <Button onClick={onOpen} colorScheme="blue" leftIcon={<AddIcon />} size="lg">
                        Создать доску
                    </Button>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Создать новую доску</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={createBoard}>
                            <ModalBody>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel>Название доски</FormLabel>
                                        <Input
                                            placeholder="Например: Разработка"
                                            value={newBoard.name}
                                            onChange={(e) => setNewBoard({...newBoard, name: e.target.value})}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Описание</FormLabel>
                                        <Textarea
                                            placeholder="Описание доски (необязательно)"
                                            value={newBoard.description}
                                            onChange={(e) => setNewBoard({...newBoard, description: e.target.value})}
                                        />
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="outline" mr={3} onClick={onClose}>
                                    Отмена
                                </Button>
                                <Button type="submit" colorScheme="blue">
                                    Создать
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    );
};

export default BoardsList;
