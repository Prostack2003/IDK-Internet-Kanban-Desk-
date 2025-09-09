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

const EditTaskModal = ({ isOpen, onClose, editingTask, setEditingTask, loading, onUpdateTask }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateTask(e);
    };

    if (!editingTask) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    ✏️ Редактировать задачу
                </ModalHeader>
                <ModalCloseButton />

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Название задачи</FormLabel>
                                <Input
                                    placeholder="Введите название задачи"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                    size="lg"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Описание задачи</FormLabel>
                                <Textarea
                                    placeholder="Введите описание задачи"
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                    size="lg"
                                    rows={4}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Статус задачи</FormLabel>
                                <HStack spacing={4}>
                                    <Button
                                        type="button"
                                        colorScheme={editingTask.status === 'todo' ? 'red' : 'gray'}
                                        onClick={() => setEditingTask({...editingTask, status: 'todo'})}
                                        flex={1}
                                    >
                                        📋 К выполнению
                                    </Button>
                                    <Button
                                        type="button"
                                        colorScheme={editingTask.status === 'inprogress' ? 'yellow' : 'gray'}
                                        onClick={() => setEditingTask({...editingTask, status: 'inprogress'})}
                                        flex={1}
                                    >
                                        🚀 В работе
                                    </Button>
                                    <Button
                                        type="button"
                                        colorScheme={editingTask.status === 'done' ? 'green' : 'gray'}
                                        onClick={() => setEditingTask({...editingTask, status: 'done'})}
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
                            loadingText="Обновление..."
                        >
                            Обновить задачу
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default EditTaskModal;
