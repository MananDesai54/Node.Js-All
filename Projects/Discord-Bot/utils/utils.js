const checkVoiceConnected = (message) => {
    return message.member.voice.channel;
}

const toggleRole = (reaction,user,action) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id)

    if(reaction.message.id === '749295738923515994') {
        switch (name) {
            case '🐶':
                action === 'add' ? 
                member.roles.add('749291588722622575') :
                member.roles.remove('749291588722622575');
                break;
            case '🦁':
                action === 'add' ? 
                member.roles.add('749291660378374285'):
                member.roles.remove('749291660378374285');
                break;
            case '🐯':
                action === 'add' ? 
                member.roles.add('749291723720491088'):
                member.roles.remove('749291723720491088');
                break;
            case '🐴':
                action === 'add' ? 
                member.roles.add('749291825390420089'):
                member.roles.remove('749291825390420089');
                break;
            case '🐘':
                action === 'add' ? 
                member.roles.add('749292191045910762'):
                member.roles.remove('749292191045910762');
                break;
            case '🦊':
                action === 'add' ? 
                member.roles.add('749291960166252664'):
                member.roles.remove('749291960166252664');
                break;
        
            default:
                break;
        }
    }
}

module.exports = {
    checkVoiceConnected,
    toggleRole
}