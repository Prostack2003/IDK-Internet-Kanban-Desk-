import React from 'react';
import { Card, CardBody, Heading, VStack, Text } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTask from './SortableTask.jsx';

const DroppableColumn = ({ id, title, tasks, onEdit, onClick }) => {
    const { setNodeRef } = useDroppable({ id });

    const columnColors = {
        todo: { bg: 'red.50', border: 'red.200' },
        inprogress: { bg: 'yellow.50', border: 'yellow.200' },
        done: { bg: 'green.50', border: 'green.200' }
    };

    return (
        <Card
            bg={columnColors[id].bg}
            borderWidth={2}
            borderColor={columnColors[id].border}
            height="fit-content"
        >
            <CardBody>
                <Heading size="md" mb={4} textAlign="center">
                    {title}
                </Heading>

                <VStack spacing={2} align="stretch" ref={setNodeRef}>
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map(task => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                onEdit={onEdit}
                                onClick={onClick}
                            />
                        ))}
                    </SortableContext>

                    {tasks.length === 0 && (
                        <Text textAlign="center" color="gray.500" fontStyle="italic" py={4}>
                            Нет задач
                        </Text>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
};

export default DroppableColumn;
