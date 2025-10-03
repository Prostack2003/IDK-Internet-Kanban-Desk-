import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    HStack
} from '@chakra-ui/react';

const AddTaskModal = ({ isOpen, onClose, newTask, setNewTask, loading, onAddTask }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTask(e);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Добавить новую задачу
                </ModalHeader>
                <ModalCloseButton />

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Название задачи</FormLabel>
                                <Input
                                    placeholder="Введите название задачи"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    size="lg"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Описание задачи</FormLabel>
                                <Textarea
                                    placeholder="Введите описание задачи (необязательно)"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                    size="lg"
                                    rows={4}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Статус задачи</FormLabel>
                                <HStack spacing={4}>
                                    <Button
                                        type="button"
                                        colorScheme={newTask.status === 'todo' ? 'red' : 'gray'}
                                        onClick={() => setNewTask({...newTask, status: 'todo'})}
                                        flex={1}
                                    >
                                        📋 К выполнению
                                    </Button>
                                    <Button
                                        type="button"
                                        colorScheme={newTask.status === 'inprogress' ? 'yellow' : 'gray'}
                                        onClick={() => setNewTask({...newTask, status: 'inprogress'})}
                                        flex={1}
                                    >
                                        🚀 В работе
                                    </Button>
                                    <Button
                                        type="button"
                                        colorScheme={newTask.status === 'done' ? 'green' : 'gray'}
                                        onClick={() => setNewTask({...newTask, status: 'done'})}
                                        flex={1}
                                    >
                                        ✅ Выполнено
                                    </Button>
                                </HStack>
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={loading}
                            loadingText="Добавление..."
                        >
                            Добавить задачу
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddTaskModal;
