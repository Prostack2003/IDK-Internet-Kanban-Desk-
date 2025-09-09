import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

export const useTaskModals = () => {
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);

    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose
    } = useDisclosure();

    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose
    } = useDisclosure();

    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose
    } = useDisclosure();

    const openAddModal = () => {
        setNewTask({ title: '', description: '', status: 'todo' });
        onAddOpen();
    };

    const openEditModal = (task) => {
        setEditingTask({ ...task });
        onEditOpen();
    };

    const openViewModal = (task) => {
        setViewingTask(task);
        onViewOpen();
    };

    const closeAllModals = () => {
        onAddClose();
        onEditClose();
        onViewClose();
        setEditingTask(null);
        setViewingTask(null);
    };

    return {
        // States
        newTask,
        editingTask,
        viewingTask,

        // Setters
        setNewTask,
        setEditingTask,

        // Modal states
        isAddOpen,
        isEditOpen,
        isViewOpen,

        // Modal actions
        openAddModal,
        openEditModal,
        openViewModal,
        closeAllModals,
        onAddClose,
        onEditClose,
        onViewClose
    };
};
