import { DataItemCommon } from '../../types';

export const setItemDisabled = (
    item: DataItemCommon,
    disabledList?: Array<Pick<DataItemCommon, 'id' | 'selected'>>,
) => {
    const idx = (disabledList || []).findIndex(({ id }) => {
        return id?.toLowerCase() === item.id?.toLowerCase();
    });
    item.disabled = idx > -1;
    return item;
};

export const setItemSelected = (item: DataItemCommon, selectedData: DataItemCommon[]) => {
    const idx = selectedData.findIndex(({ id }) => {
        return item.id?.toLowerCase() === id?.toLowerCase();
    });
    item.selected = idx > -1;
};

export const setItemData = (
    item: DataItemCommon,
    opts: {
        selectedData: DataItemCommon[];
        disabledList: Array<Pick<DataItemCommon, 'id' | 'selected'>>;
    },
) => {
    const { selectedData, disabledList } = opts;
    if (selectedData) {
        setItemSelected(item, selectedData);
    }
    if (disabledList?.length > 0) {
        setItemDisabled(item, disabledList);
    }
    return item;
};

export const removeSelectedData = (item: DataItemCommon, selectedData: DataItemCommon[]) => {
    const idx = selectedData.findIndex(({ id }) => {
        return item.id?.toLowerCase() === id?.toLowerCase();
    });

    if (idx > -1) {
        selectedData.splice(idx, 1);
    }
};
