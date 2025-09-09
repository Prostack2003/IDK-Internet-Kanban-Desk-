import { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const useDnD = (onMoveTask) => {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        await onMoveTask(taskId, newStatus);
    };

    return {
        activeId,
        sensors,
        handleDragStart,
        handleDragEnd
    };
};
