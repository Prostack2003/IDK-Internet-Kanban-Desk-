import React from 'react';
import {
    Box,
    Grid,
    Button,
    VStack,
    Spinner,
    Container,
    HStack
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';


import DroppableColumn from '../Column/DroppableColumn';
import AddTaskModal from '../TaskModal/AddTaskModal';
import EditTaskModal from '../TaskModal/EditTaskModal';
import ViewTaskModal from '../TaskModal/ViewTaskModal';


import { useTasks } from '../../hooks/useTasks.js';
import { useTaskModals } from '../../hooks/useTaskModals.js';
import { useDnD } from '../../hooks/useDnD.js';
import {closestCorners, DndContext} from "@dnd-kit/core";

const KanbanBoard = () => {

    const { tasks, loading, tasksLoading, addTask, updateTask, deleteTask, moveTask } = useTasks();
    const {
        newTask, editingTask, viewingTask, setNewTask, setEditingTask,
        isAddOpen, isEditOpen, isViewOpen,
        openAddModal, openEditModal, openViewModal, onAddClose, onEditClose, onViewClose
    } = useTaskModals();


    const { activeId, sensors, handleDragStart, handleDragEnd } = useDnD(moveTask);


    const handleAddTask = async (e) => {
        e.preventDefault();
        const success = await addTask(newTask);
        if (success) {
            onAddClose();
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editingTask) return;

        const success = await updateTask(editingTask.id, editingTask);
        if (success) {
            onEditClose();
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) return;
        await deleteTask(taskId);
    };

    const handleTaskClick = (task) => {
        openViewModal(task);
    };


    const columns = {
        todo: tasks.filter(task => task.status === 'todo'),
        inprogress: tasks.filter(task => task.status === 'inprogress'),
        done: tasks.filter(task => task.status === 'done')
    };


    if (tasksLoading) {
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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                        {Object.entries(columns).map(([status, columnTasks]) => (
                            <DroppableColumn
                                key={status}
                                id={status}
                                title={
                                    status === 'todo' ? '📋 К выполнению' :
                                        status === 'inprogress' ? '🚀 В работе' : '✅ Выполнено'
                                }
                                tasks={columnTasks}
                                onEdit={openEditModal}
                                onClick={handleTaskClick}
                            />
                        ))}
                    </Grid>
                </DndContext>

                <HStack justify="center">
                    <Button onClick={openAddModal} colorScheme="blue" leftIcon={<AddIcon />} size="lg">
                        Добавить задачу
                    </Button>
                </HStack>

                <AddTaskModal
                    isOpen={isAddOpen}
                    onClose={onAddClose}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    loading={loading}
                    onAddTask={handleAddTask}
                />

                <EditTaskModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    loading={loading}
                    onUpdateTask={handleUpdateTask}
                />

                <ViewTaskModal
                    isOpen={isViewOpen}
                    onClose={onViewClose}
                    task={viewingTask}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                />
            </VStack>
        </Container>
    );
};

export default KanbanBoard;
