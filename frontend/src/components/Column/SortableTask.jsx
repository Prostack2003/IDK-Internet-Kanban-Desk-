import React from 'react';
import {
    Card,
    CardBody,
    Heading,
    Text,
    HStack,
    Box,
    IconButton
} from '@chakra-ui/react';
import {EditIcon} from '@chakra-ui/icons';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableTask = ({task, onEdit, onClick}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(task);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(task);
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            bg="white"
            shadow="sm"
            mb={3}
            {...attributes}
            {...listeners}
            cursor={isDragging ? 'grabbing' : 'grab'}
            transition={isDragging ? 'none' : 'box-shadow 0.2s ease-out'}
            _hover={{
                shadow: isDragging ? 'sm' : 'md'
            }}
            onClick={handleClick}
            minH="100px"
        >
            <CardBody p={3}>
                <HStack justify="space-between" align="start" spacing={2}>
                    <Box flex="1" minW={0}>
                        {}
                        <Heading
                            size="sm"
                            mb={1}
                            wordBreak="break-word"
                            overflowWrap="break-word"
                            noOfLines={2}
                        >
                            {task.title}
                        </Heading>
                        {task.description && (
                            <Text
                                fontSize="xs"
                                color="gray.600"
                                wordBreak="break-word"
                                whiteSpace="pre-line"
                                noOfLines={1}
                                mb={1}
                            >
                                {task.description}
                            </Text>
                        )}
                        <Text fontSize="xs" color="gray.400">
                            {new Date(task.created_at).toLocaleDateString('ru-RU')}
                        </Text>
                    </Box>

                    {}
                    <IconButton
                        icon={<EditIcon/>}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={handleEditClick}
                        aria-label="Редактировать задачу"
                        flexShrink={0}
                    />
                </HStack>
            </CardBody>
        </Card>
    );
};

export default SortableTask;
