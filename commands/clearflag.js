exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  let tgtRole = message.guild.roles.find(r => r.name == "merging");
  let mergeChat = message.guild.channels.find(c => c.name == "merge_chat");

  // for each role mention in message
//  message.mentions.roles.forEach(function(arg) {
//    let mRole = arg;
    let mRole = tgtRole;
    let membersWithRole = mRole.members;
    console.log(`Got ${membersWithRole.size} members with that role.`);

    // give all members the role tgtRole (@merging)
    membersWithRole.forEach(function(mem) {
      mem.removeRole(mRole);
    });

    // for each permission overwrite in #merge_chat, do:
    mergeChat.permissionOverwrites.forEach(p => {
      // find all server roles with overrides for #merge_chat
      role = message.guild.roles.get(p.id);
      if(role.name.match(/^[0-9]/)) {
        message.reply(`${role.name} removed from #merge_chat`);
        p.delete();
      }
    });


//    message.channel.send(`ALL users have been unflagged as @merging`);
    message.channel.send(`ALL server roles have been removed from #merge_chat`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "clearflag",
  category: "Merge Administration",
  description: "Remove @merging role from ALL users.",
  usage: "flag"
};
