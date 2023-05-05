import React from 'react';
import PickerContext from '../../../../context/PickerContext';
import './index.less';

export default function DefaultHead() {
    const { langConfig, selectedData } = React.useContext(PickerContext);
    return (
        <div className="ee-contacts-picker__right-head">
            <div className="ee-contacts-picker__right-head-title">
                {langConfig.hasSelected} {selectedData ? selectedData?.length : 0}
            </div>
        </div>
    );
}
