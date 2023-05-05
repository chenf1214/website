import React from 'react';
import DefaultHead from '../DefaultHead';
import SelectedList from '../SelectedList';
import { DataItemCommon } from '../../../../../types';
import './index.less';

interface IProps {
    selectedData: DataItemCommon[];
    onItemClick?: (id: string, checked: boolean, searchMode?: boolean) => Promise<void>;
    handleItemRemove: (item: DataItemCommon, searchMode?: boolean) => Promise<void>;
}

export default function DefaultRightComp(props: IProps) {
    const { handleItemRemove } = props;
    return (
        <div className="ee-contacts-picker__default-right">
            <DefaultHead />
            <div className="ee-contacts-picker__default-right-list">
                <SelectedList handleItemRemove={handleItemRemove} />
            </div>
        </div>
    );
}
