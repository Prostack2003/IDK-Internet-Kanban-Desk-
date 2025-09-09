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
    Text,
    Box
} from '@chakra-ui/react';

const ViewTaskModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    👀 Просмотр задачи
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Название задачи</FormLabel>
                            <Input
                                value={task.title}
                                size="lg"
                                fontWeight="bold"
                                readOnly
                                wordBreak="break-word"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Описание задачи</FormLabel>
                            <Box
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                p={3}
                                bg="gray.50"
                                maxH="300px"
                                overflowY="auto"
                                className="custom-scrollbar"
                            >
                                <Text
                                    whiteSpace="pre-wrap"
                                    wordBreak="break-word"
                                    overflowWrap="break-word"
                                    fontSize="sm"
                                >
                                    {task.description || 'Описание отсутствует'}
                                </Text>
                            </Box>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Статус задачи</FormLabel>
                            <Text fontSize="lg" fontWeight="medium">
                                {task.status === 'todo' && '📋 К выполнению'}
                                {task.status === 'inprogress' && '🚀 В работе'}
                                {task.status === 'done' && '✅ Выполнено'}
                            </Text>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Дата создания</FormLabel>
                            <Text>
                                {new Date(task.created_at).toLocaleDateString('ru-RU')}
                            </Text>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => {
                            onClose();
                            onDelete(task.id);
                        }}
                        mr={2}
                    >
                        🗑️ Удалить
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            onClose();
                            onEdit(task);
                        }}
                    >
                        ✏️ Редактировать
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewTaskModal;
