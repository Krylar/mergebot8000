exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  let g = message.guild;

  let aowChat = g.channels.find("name", "AoW Chats");

  let tgtRole = message.guild.roles.find("name", "merging");

  // for each role mention in message
  args.forEach(function(arg) {
    let mRole = g.roles.find("name", arg);

    let membersWithRole = mRole.members;
    console.log(`Got ${membersWithRole.size} members with that role.`);

    // give all members the role tgtRole (@merging)
    membersWithRole.forEach(function(mem) {
      mem.removeRole(tgtRole)
    });

    // move channel to AoW Chats category
/*    let mChannel = g.channels.find("name", arg);
    if(mChannel) {
      mChannel.setParent(aowChat);
    }
*/
    message.channel.send(`Users with role ${mRole.toString()} have been unflagged as @merging`);
  });



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unflag",
  category: "Merge Administration",
  description: "Unflags server @roles for merging",
  usage: "flag <server1> <server2> <..serverN>"
};
