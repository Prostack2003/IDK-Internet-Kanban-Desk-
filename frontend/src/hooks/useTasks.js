// hooks/useTasks.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useTasks = (boardId) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tasksLoading, setTasksLoading] = useState(true);

    useEffect(() => {
        if (boardId) {
            fetchTasks();
        } else {
            setTasksLoading(false);
        }
    }, [boardId]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/boards/${boardId}/tasks`);
            setTasks(response.data);
        } catch (error) {
            toast.error('Ошибка загрузки задач');
        } finally {
            setTasksLoading(false);
        }
    };

    const addTask = async (taskData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/boards/${boardId}/tasks`, {
                ...taskData,
                status: taskData.status || 'todo'
            });
            setTasks(prev => [...prev, response.data]);
            toast.success('Задача добавлена!');
            return true;
        } catch (error) {
            toast.error('Ошибка добавления задачи');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskId, taskData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/tasks/${taskId}`, taskData);
            setTasks(prev => prev.map(task =>
                task.id === taskId ? response.data : task
            ));
            toast.success('Задача обновлена!');
            return true;
        } catch (error) {
            toast.error('Ошибка обновления задачи');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task.id !== taskId));
            toast.success('Задача удалена!');
            return true;
        } catch (error) {
            toast.error('Ошибка удаления задачи');
            return false;
        }
    };

    const moveTask = async (taskId, newStatus) => {
        try {
            const response = await axios.patch(`/api/tasks/${taskId}`, {
                status: newStatus
            });
            setTasks(prev => prev.map(task =>
                task.id === taskId ? response.data : task
            ));
            return true;
        } catch (error) {
            toast.error('Ошибка перемещения задачи');
            return false;
        }
    };

    return {
        tasks,
        loading,
        tasksLoading,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        fetchTasks
    };
};
