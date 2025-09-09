import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tasksLoading, setTasksLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            toast.error('Ошибка загрузки задач');
            console.error('Error fetching tasks:', error);
        } finally {
            setTasksLoading(false);
        }
    };

    const addTask = async (taskData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/tasks', taskData);
            setTasks(prev => [...prev, response.data]);
            toast.success('Задача добавлена!');
            return true;
        } catch (error) {
            toast.error('Ошибка добавления задачи');
            console.error('Error adding task:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskId, taskData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/tasks/${taskId}`, taskData);
            setTasks(prev => prev.map(task => task.id === taskId ? response.data : task));
            toast.success('Задача обновлена!');
            return true;
        } catch (error) {
            toast.error('Ошибка обновления задачи');
            console.error('Error updating task:', error);
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
            console.error('Error deleting task:', error);
            return false;
        }
    };

    const moveTask = async (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return false;

        try {
            const response = await axios.put(`/api/tasks/${taskId}`, {
                ...task,
                status: newStatus
            });
            setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
            toast.success('Задача перемещена!');
            return true;
        } catch (error) {
            toast.error('Ошибка перемещения задачи');
            console.error('Error moving task:', error);
            return false;
        }
    };

    return {
        tasks,
        loading,
        tasksLoading,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask
    };
};
