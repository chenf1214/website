import React, { useCallback, useRef } from 'react';
import {
    ContactPickerProps,
    DataItemCommon,
    PickerResult,
    RightCompRefProps,
    UseSelectionResult,
} from '../../../types';
import PickerContext from '../../context/PickerContext';
import Footer from '../Footer';
import './index.less';
import SearchInputComp from './LeftView/SearchInputComp';
import SpaceTab from './LeftView/SpaceTab';
import DefaultRightComp from './RightView/DefaultRightComp';

type IProps = Pick<ContactPickerProps, 'getSearchData' | 'RightComp' | 'getClsTag'> & {
    onClose: () => void;
    onConfirm: (result: PickerResult) => Promise<void>;
} & Pick<UseSelectionResult, 'loadTabData' | 'onItemClick' | 'onExpandClick'>;

function ContentBox(props: IProps) {
    const {
        onConfirm,
        onClose,
        onItemClick,
        RightComp = DefaultRightComp,
        loadTabData,
        getSearchData,
        onExpandClick,
        getClsTag,
    } = props;

    const { searchMode, disabledList, selectedData, disableSearch } = React.useContext(PickerContext);

    const rightCompRef = useRef<RightCompRefProps>();

    const handlerItemClick = useCallback(
        async (item: DataItemCommon) => {
            onItemClick(item.id, !item.selected, searchMode);
        },
        [onItemClick, searchMode],
    );

    const handleItemRemove = useCallback(
        async (item: DataItemCommon) => {
            onItemClick(item.id, false, searchMode);
        },
        [onItemClick, searchMode],
    );

    const selectedList = React.useMemo(() => {
        if (disabledList?.length === 0) {
            return selectedData;
        }
        return selectedData?.filter((item) => !item.disabled);
    }, [disabledList?.length, selectedData]);

    // 获取右侧map数据
    const getResult = useCallback(() => {
        if (rightCompRef?.current) {
            return rightCompRef?.current?.getResult();
        }
        return {};
    }, []);

    return (
        <div className="ee-contacts-picker__body">
            <div className="ee-contacts-picker__left">
                {/* 头部input框 */}
                {!disableSearch && <SearchInputComp loadTabData={loadTabData} getSearchData={getSearchData} />}
                {/* tab切换组件 */}
                <SpaceTab
                    handlerItemClick={handlerItemClick}
                    loadTabData={loadTabData}
                    onExpandClick={onExpandClick}
                    getSearchData={getSearchData}
                    getClsTag={getClsTag}
                />
                <div className="line" />
            </div>
            <div className="ee-contacts-picker__right">
                <RightComp ref={rightCompRef} selectedData={selectedList} handleItemRemove={handleItemRemove} />
                <Footer onConfirm={onConfirm} onClose={onClose} getResult={getResult} />
            </div>
        </div>
    );
}

export default ContentBox;
