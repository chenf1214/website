import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';
import React from 'react';
import { getDefaultAvatar } from '../../utils';

function UserAvatar(props: AvatarProps) {
    const defaultAvatar = React.useMemo(() => {
        const src = getDefaultAvatar();
        return <img src={src} alt="" />;
    }, []);

    return <Avatar {...props} icon={defaultAvatar} />;
}

export default UserAvatar;
