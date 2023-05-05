import React from 'react';
import PickerContext from '../../context/PickerContext';
import './index.less';

function Head() {
    const { title, langConfig } = React.useContext(PickerContext);
    // const { title, langConfig } = state;
    return <div className="ee-contacts-picker__header">{title || langConfig.selectContacts}</div>;
}

export default Head;
