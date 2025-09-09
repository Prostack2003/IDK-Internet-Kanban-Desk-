import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton
} from '@chakra-ui/react';
import { HamburgerIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const TaskMenu = ({ task, onEdit, onDelete }) => {
    const handleEdit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onEdit(task);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(task.id);
    };

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
            <MenuList onClick={(e) => e.stopPropagation()}>
                <MenuItem
                    icon={<EditIcon />}
                    onClick={handleEdit}
                >
                    Редактировать
                </MenuItem>
                <MenuItem
                    icon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Удалить
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default TaskMenu;
