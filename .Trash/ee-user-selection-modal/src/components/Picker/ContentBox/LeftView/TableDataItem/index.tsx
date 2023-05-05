import { Checkbox } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { DataItemCommon } from '../../../../../types';
import UserAvatar from '../../../../Avatar';
import PickerContext, { IPickerContext } from '../../../../context/PickerContext';
import withContext from '../../../../context/withContext';
import IconFont from '../../../../icon/IconFont';
import './index.less';

interface Props {
    item: DataItemCommon;
    onItemClick: (item: DataItemCommon) => void;
    onExpandClick?: (item: DataItemCommon) => void; // 列表项点击展开
}

type IProps = Props & Props & Pick<IPickerContext, 'canSelectedExpandKeys' | 'expandTabKeys' | 'dispatch'>;

function TableDataItem(props: IProps) {
    const { item, canSelectedExpandKeys, expandTabKeys, dispatch, onItemClick, onExpandClick } = props;

    const showCheckBox = React.useMemo(() => {
        if (expandTabKeys.includes(item.type)) {
            return canSelectedExpandKeys;
        }
        return true;
    }, [canSelectedExpandKeys, expandTabKeys, item.type]);

    const itemExpandHandler = React.useCallback(
        (item) => {
            if (item.disabled) {
                return;
            }
            // 可以选择展开项的 item
            onExpandClick?.(item);
            dispatch({ type: 'setEnabled', payload: { bool: true } });
        },
        [dispatch, onExpandClick],
    );

    const itemClickHandler = React.useCallback(
        (item) => {
            if (item.disabled) {
                return;
            }
            // 可以选择展开项的 item
            if (showCheckBox) {
                onItemClick(item);
            } else {
                itemExpandHandler(item);
            }
        },
        [itemExpandHandler, onItemClick, showCheckBox],
    );
    const renderCheckBox = useMemo(() => {
        if (!showCheckBox) {
            return <Checkbox className="group_checkbox" disabled={true} checked={false} />;
        }
        return <Checkbox disabled={item.disabled} checked={item.selected} />;
    }, [item.disabled, item.selected, showCheckBox]);

    return (
        <div
            className="left-list__item"
            onClick={(e) => {
                e.stopPropagation();
                itemClickHandler(item);
            }}
        >
            <div className="left-list__item-checkbox-wrap">{renderCheckBox}</div>
            <div className="left-list__item-avatar">
                <UserAvatar src={item.avatarUrl} />
            </div>
            <div className="left-list__item-title-wrap">
                <div className="title__content ellipsis">{item.title}</div>
                <div className="title__desc ellipsis">{item?.subTitle || ''}</div>
            </div>
            {expandTabKeys.includes(item.type) && (
                <div
                    className="left-list__item-next"
                    onClick={(e) => {
                        e.stopPropagation();
                        itemExpandHandler(item);
                    }}
                >
                    <IconFont type="icon-direction-right" className="icon-direction-right" />
                </div>
            )}
        </div>
    );
}

export default withContext(PickerContext, ['canSelectedExpandKeys', 'expandTabKeys', 'dispatch'], TableDataItem);
