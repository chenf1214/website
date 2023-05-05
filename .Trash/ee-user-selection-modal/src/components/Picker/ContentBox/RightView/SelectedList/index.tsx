import React from 'react';
import IconFont from '../../../../icon/IconFont';
import './index.less';
import TableDataItem from '../TableDataItem';
import { DataItemCommon } from '../../../../../types';
import PickerContext from '../../../../context/PickerContext';
import List from 'rc-virtual-list';
interface IProps {
    handleItemRemove: (item: DataItemCommon, searchMode?: boolean) => Promise<void>;
}

export default function SelectedList(props: IProps) {
    const { handleItemRemove } = props;
    const { selectedData } = React.useContext(PickerContext);
    // 删除
    const handleItemClick = React.useCallback(
        (item, bool) => {
            handleItemRemove(item, false);
        },
        [handleItemRemove],
    );

    if (selectedData?.length === 0) {
        return (
            <div className="ee-contacts-picker__right-list-wrap">
                <div className="ee-contacts-picker__found-list">
                    <IconFont type="icon-general-team" className="icon-general-team" />
                </div>
            </div>
        );
    }
    if (selectedData?.length < 8) {
        return (
            <div className="ee-contacts-picker__right-list-wrap">
                {selectedData.map((item) => {
                    return <TableDataItem key={item.id} item={item} handleItemClick={handleItemClick} />;
                })}
            </div>
        );
    }

    return (
        <div className="ee-contacts-picker__right-list-wrap">
            <List data={selectedData} height={420} itemHeight={56} itemKey="id">
                {(item) => {
                    return <TableDataItem key={item.id} item={item} handleItemClick={handleItemClick} />;
                }}
            </List>
        </div>
    );
}
