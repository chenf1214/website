import React from 'react';
import IconFont from '../../../../icon/IconFont';
import UserAvatar from '../../../../Avatar';
import './index.less';
import { useMemo } from 'react';
import { useCallback } from 'react';

interface IProps {
    item: any;
    handleItemClick: (item: any, bool: boolean) => void;
}

export default function TableDataItem({ item, handleItemClick }: IProps) {
    const removeClick = useCallback(
        (item) => {
            if (item.disabled) {
                return;
            }
            handleItemClick(item, !item.selected);
        },
        [handleItemClick],
    );
    return (
        <div className="list-wrap__item">
            <div className="list-wrap__item-avatar">
                <UserAvatar src={item.avatarUrl} />
            </div>
            <div className="list-wrap__item-title-wrap">
                <div className="list-wrap__item-title-wrap-title">{item.title}</div>
            </div>
            <IconFont
                type="icon-prompt-closecircle"
                className={`icon-prompt-closecircle ${item.disabled ? 'list_click_disabled' : ''}`}
                onClick={() => removeClick(item)}
            />
        </div>
    );
}
