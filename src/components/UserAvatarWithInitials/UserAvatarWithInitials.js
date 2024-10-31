import React from 'react';
import Cookies from 'js-cookie';

import './styleUserAvatarWithInitials.css'

const UserAvatarWithInitials = () => {

    const renderUserAvatar = () => {
        const initials = Cookies.get('userName')
            .split(' ')
            .map(word => word[0])
            .slice(0, 2) // Para limitar a no máximo duas iniciais
            .join('')
            .toUpperCase();

        return (
            <div className="user-avatar">
                {/* <img
                    src={`https://api.example.com/profile-images/${id}.jpg`} // Substitua pela URL real da imagem do usuário
                    alt={name}
                /> */}
                <div className="initials">
                    {initials}
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderUserAvatar()}
        </div>
    );
};

export default UserAvatarWithInitials;
